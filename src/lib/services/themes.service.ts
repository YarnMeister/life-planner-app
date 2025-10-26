/**
 * Themes Service
 * Handles all theme-related business logic
 */

import { eq, and } from 'drizzle-orm';
import { themes, tasks } from '@/lib/auth/db.server';
import { BaseService, ValidationError } from './base.service';
import { pillarsService } from './pillars.service';

export interface CreateThemeInput {
  pillarId: string;
  name: string;
  ratingPercent?: number;
}

export interface UpdateThemeInput {
  name?: string;
  ratingPercent?: number;
  lastReflectionNote?: string;
}

export class ThemesService extends BaseService {
  /**
   * Get all themes for a user
   */
  async getThemes(userId: string) {
    return this.db.query.themes.findMany({
      where: eq(themes.userId, userId),
      orderBy: (themes: any, { asc }: any) => [asc(themes.createdAt)],
    });
  }

  /**
   * Get a single theme by ID
   */
  async getTheme(id: string, userId: string) {
    const theme = await this.db.query.themes.findFirst({
      where: and(eq(themes.id, id), eq(themes.userId, userId)),
    });

    this.verifyExists(theme, 'Theme');
    return theme;
  }

  /**
   * Get themes by pillar
   */
  async getThemesByPillar(pillarId: string, userId: string) {
    return this.db.query.themes.findMany({
      where: and(eq(themes.pillarId, pillarId), eq(themes.userId, userId)),
      orderBy: (themes: any, { asc }: any) => [asc(themes.createdAt)],
    });
  }

  /**
   * Create a new theme
   */
  async createTheme(input: CreateThemeInput, userId: string) {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError('Theme name is required');
    }

    // Verify pillar exists and belongs to user
    await pillarsService.getPillar(input.pillarId, userId);

    const ratingPercent = input.ratingPercent ?? 50;
    if (ratingPercent < 0 || ratingPercent > 100) {
      throw new ValidationError('Rating percent must be between 0 and 100');
    }

    const result = await this.db
      .insert(themes)
      .values({
        userId,
        pillarId: input.pillarId,
        name: input.name.trim(),
        ratingPercent,
      })
      .returning();

    // Recalculate pillar average
    await pillarsService.recalculateAverage(input.pillarId, userId);

    return result[0];
  }

  /**
   * Update a theme
   */
  async updateTheme(id: string, input: UpdateThemeInput, userId: string) {
    // Verify ownership
    const theme = await this.getTheme(id, userId);

    // Validate input
    if (input.name !== undefined && input.name.trim().length === 0) {
      throw new ValidationError('Theme name cannot be empty');
    }
    if (input.ratingPercent !== undefined) {
      if (input.ratingPercent < 0 || input.ratingPercent > 100) {
        throw new ValidationError('Rating percent must be between 0 and 100');
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.ratingPercent !== undefined) {
      updateData.previousRating = theme.ratingPercent;
      updateData.ratingPercent = input.ratingPercent;
    }
    if (input.lastReflectionNote !== undefined) {
      updateData.lastReflectionNote = input.lastReflectionNote;
    }
    updateData.updatedAt = new Date();

    const result = await this.db
      .update(themes)
      .set(updateData)
      .where(eq(themes.id, id))
      .returning();

    // Recalculate pillar average if rating changed
    if (input.ratingPercent !== undefined) {
      await pillarsService.recalculateAverage(theme.pillarId, userId);
    }

    return result[0];
  }

  /**
   * Delete a theme and all associated tasks
   */
  async deleteTheme(id: string, userId: string) {
    // Verify ownership
    const theme = await this.getTheme(id, userId);

    // Delete theme (cascade will handle tasks)
    await this.db.delete(themes).where(eq(themes.id, id));

    // Recalculate pillar average
    await pillarsService.recalculateAverage(theme.pillarId, userId);
  }

  /**
   * Get theme with all tasks
   */
  async getThemeWithTasks(id: string, userId: string) {
    const theme = await this.getTheme(id, userId);

    const themeTasks = await this.db.query.tasks.findMany({
      where: eq(tasks.themeId, id),
      orderBy: (tasks: any, { asc }: any) => [asc(tasks.rank)],
    });

    return {
      ...theme,
      tasks: themeTasks,
    };
  }
}

// Export singleton instance
export const themesService = new ThemesService();

