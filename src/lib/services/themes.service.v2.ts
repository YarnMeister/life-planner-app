import { planningRepository, VersionMismatchError } from '@/lib/repositories/planning.repository';
import { Theme, ThemesDoc, TasksDoc } from '@/types/planning.types';
import {
  findItemIndex,
  createAddItemPatch,
  createRemoveItemPatch
} from '@/lib/utils/json-patch.utils';
import { Operation } from 'fast-json-patch';
import { v4 as uuidv4 } from 'uuid';
import { pillarsServiceV2 } from './pillars.service.v2';

export interface CreateThemeInput {
  pillarId: string;
  name: string;
  rating: number;
  lastReflectionNote?: string;
}

export interface UpdateThemeInput {
  name?: string;
  rating?: number;
  lastReflectionNote?: string;
  previousRating?: number;
}

export class ThemesServiceV2 {
  /**
   * Retry wrapper for handling version conflicts
   * Automatically retries once if a VersionMismatchError occurs
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 1
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (error instanceof VersionMismatchError && attempt < maxRetries) {
          // Version conflict - retry once with fresh data
          lastError = error;
          continue;
        }
        // Not a version error, or out of retries
        throw error;
      }
    }

    throw lastError!;
  }

  /**
   * Remove undefined values from an object (JSON Patch doesn't allow undefined)
   */
  private removeUndefined<T extends Record<string, any>>(obj: T): T {
    const result = {} as T;
    for (const key in obj) {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Get all themes for a user
   */
  async getThemes(userId: string): Promise<Theme[]> {
    const doc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
    return doc?.data ?? [];
  }

  /**
   * Get themes by pillar
   */
  async getThemesByPillar(pillarId: string, userId: string): Promise<Theme[]> {
    const themes = await this.getThemes(userId);
    return themes.filter((t) => t.pillarId === pillarId);
  }

  /**
   * Get a single theme by ID
   */
  async getTheme(id: string, userId: string): Promise<Theme> {
    const themes = await this.getThemes(userId);
    const theme = themes.find((t) => t.id === id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return theme;
  }

  /**
   * Create a new theme
   */
  async createTheme(input: CreateThemeInput, userId: string): Promise<Theme> {
    // Verify pillar exists
    await pillarsServiceV2.getPillar(input.pillarId, userId);

    // Generate UUID outside retry to ensure idempotency
    const now = new Date().toISOString();
    const newTheme: Theme = this.removeUndefined({
      id: uuidv4(),
      pillarId: input.pillarId,
      name: input.name.trim(),
      rating: input.rating,
      lastReflectionNote: input.lastReflectionNote,
      order: 0, // Will be set correctly in retry closure
      createdAt: now,
      updatedAt: now,
    } as Theme);

    // Retry only the theme patch operation
    await this.withRetry(async () => {
      const doc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
      if (!doc) {
        throw new Error('Themes document not initialized');
      }

      // Update order based on current doc length (in case of retry)
      newTheme.order = doc.data.length;

      // Use JSON Patch to add
      const patch = createAddItemPatch(newTheme);
      await planningRepository.patchDoc<ThemesDoc>(
        userId,
        'themes',
        patch,
        doc.version
      );
    });

    // Recalculate pillar average outside retry (has its own retry logic)
    await pillarsServiceV2.recalculateAverage(input.pillarId, userId);

    return newTheme;
  }

  /**
   * Update a theme
   */
  async updateTheme(
    id: string,
    input: UpdateThemeInput,
    userId: string
  ): Promise<Theme> {
    let pillarId: string | undefined;
    let ratingChanged = false;

    // Retry only the theme patch operation
    const updatedTheme = await this.withRetry(async () => {
      const doc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
      if (!doc) {
        throw new Error('Themes document not found');
      }

      const index = findItemIndex(doc.data, id);
      const theme = doc.data[index];

      const updates: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
      };
      if (input.name !== undefined) updates.name = input.name.trim();
      if (input.rating !== undefined) {
        updates.previousRating = theme.rating; // Save old rating
        updates.rating = input.rating;
        ratingChanged = true;
        pillarId = theme.pillarId;
      }
      if (input.lastReflectionNote !== undefined) {
        updates.lastReflectionNote = input.lastReflectionNote;
      }

      // Build patch operations - use 'add' for previousRating if it doesn't exist
      const patch: Operation[] = Object.entries(updates).map(([key, value]) => ({
        op: (key === 'previousRating' && !('previousRating' in theme)) ? 'add' : 'replace',
        path: `/${index}/${key}`,
        value,
      } as Operation));

      await planningRepository.patchDoc<ThemesDoc>(
        userId,
        'themes',
        patch,
        doc.version
      );

      return { ...theme, ...updates } as Theme;
    });

    // Recalculate pillar average outside retry (has its own retry logic)
    if (ratingChanged && pillarId) {
      await pillarsServiceV2.recalculateAverage(pillarId, userId);
    }

    return updatedTheme;
  }

  /**
   * Delete a theme (with dependency check)
   */
  async deleteTheme(id: string, userId: string): Promise<void> {
    // Get theme first to know which pillar to recalculate (before deletion)
    const theme = await this.getTheme(id, userId);

    // Check for dependent tasks
    const tasksDoc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    const hasTasks = tasksDoc?.data.some((t) => t.themeId === id);
    if (hasTasks) {
      throw new Error('Cannot delete theme with existing tasks');
    }

    // Retry only the theme deletion patch
    await this.withRetry(async () => {
      const doc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
      if (!doc) {
        throw new Error('Themes document not found');
      }

      const index = findItemIndex(doc.data, id);
      const patch = createRemoveItemPatch(index);
      await planningRepository.patchDoc<ThemesDoc>(
        userId,
        'themes',
        patch,
        doc.version
      );
    });

    // Recalculate pillar average outside retry (has its own retry logic)
    await pillarsServiceV2.recalculateAverage(theme.pillarId, userId);
  }

  /**
   * Get theme with all tasks (for detail view)
   */
  async getThemeWithTasks(id: string, userId: string) {
    const theme = await this.getTheme(id, userId);
    
    const tasksDoc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    const themeTasks = tasksDoc?.data.filter((t) => t.themeId === id) ?? [];

    return {
      ...theme,
      tasks: themeTasks,
    };
  }
}

// Export singleton instance
export const themesServiceV2 = new ThemesServiceV2();

