import { planningRepository, VersionMismatchError } from '@/lib/repositories/planning.repository';
import { Pillar, PillarsDoc, ThemesDoc } from '@/types/planning.types';
import {
  findItemIndex,
  createAddItemPatch,
  createUpdateItemPatch,
  createRemoveItemPatch
} from '@/lib/utils/json-patch.utils';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePillarInput {
  name: string;
  color: string;
  domain: 'work' | 'personal';
}

export interface UpdatePillarInput {
  name?: string;
  color?: string;
  domain?: 'work' | 'personal';
  rating?: number;
}

export class PillarsServiceV2 {
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
   * Get all pillars for a user
   */
  async getPillars(userId: string): Promise<Pillar[]> {
    const doc = await planningRepository.getDoc<PillarsDoc>(userId, 'pillars');
    return doc?.data ?? [];
  }

  /**
   * Get a single pillar by ID
   */
  async getPillar(id: string, userId: string): Promise<Pillar> {
    const pillars = await this.getPillars(userId);
    const pillar = pillars.find((p) => p.id === id);
    if (!pillar) {
      throw new Error('Pillar not found');
    }
    return pillar;
  }

  /**
   * Create a new pillar
   */
  async createPillar(input: CreatePillarInput, userId: string): Promise<Pillar> {
    // Generate UUID outside retry to ensure idempotency
    const now = new Date().toISOString();
    const newPillar: Pillar = {
      id: uuidv4(),
      name: input.name.trim(),
      color: input.color.trim(),
      domain: input.domain,
      rating: 0,
      order: 0, // Will be set correctly in retry closure
      createdAt: now,
      updatedAt: now,
    };

    // Retry only the pillar patch operation
    await this.withRetry(async () => {
      const doc = await planningRepository.getDoc<PillarsDoc>(userId, 'pillars');
      if (!doc) {
        throw new Error('Pillars document not initialized');
      }

      // Update order based on current doc length (in case of retry)
      newPillar.order = doc.data.length;

      // Use JSON Patch to add
      const patch = createAddItemPatch(newPillar);
      await planningRepository.patchDoc<PillarsDoc>(
        userId,
        'pillars',
        patch,
        doc.version
      );
    });

    return newPillar;
  }

  /**
   * Update a pillar
   */
  async updatePillar(
    id: string,
    input: UpdatePillarInput,
    userId: string
  ): Promise<Pillar> {
    return this.withRetry(async () => {
      const doc = await planningRepository.getDoc<PillarsDoc>(userId, 'pillars');
      if (!doc) {
        throw new Error('Pillars document not found');
      }

      const index = findItemIndex(doc.data, id);
      const pillar = doc.data[index];

      const updates: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
      };
      if (input.name !== undefined) updates.name = input.name.trim();
      if (input.color !== undefined) updates.color = input.color.trim();
      if (input.domain !== undefined) updates.domain = input.domain;
      if (input.rating !== undefined) updates.rating = input.rating;

      const patch = createUpdateItemPatch(index, updates);
      await planningRepository.patchDoc<PillarsDoc>(
        userId,
        'pillars',
        patch,
        doc.version
      );

      return { ...pillar, ...updates } as Pillar;
    });
  }

  /**
   * Delete a pillar (with dependency check)
   */
  async deletePillar(id: string, userId: string): Promise<void> {
    return this.withRetry(async () => {
      // Check for dependent themes
      const themesDoc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
      const hasThemes = themesDoc?.data.some((t) => t.pillarId === id);
      if (hasThemes) {
        throw new Error('Cannot delete pillar with existing themes');
      }

      const doc = await planningRepository.getDoc<PillarsDoc>(userId, 'pillars');
      if (!doc) {
        throw new Error('Pillars document not found');
      }

      const index = findItemIndex(doc.data, id);
      const patch = createRemoveItemPatch(index);
      await planningRepository.patchDoc<PillarsDoc>(
        userId,
        'pillars',
        patch,
        doc.version
      );
    });
  }

  /**
   * Recalculate pillar average from themes
   */
  async recalculateAverage(pillarId: string, userId: string): Promise<void> {
    return this.withRetry(async () => {
      const themesDoc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
      if (!themesDoc) return;

      const pillarThemes = themesDoc.data.filter((t) => t.pillarId === pillarId);
      if (pillarThemes.length === 0) return;

      const avgRating = Math.round(
        pillarThemes.reduce((sum, t) => sum + t.rating, 0) / pillarThemes.length
      );

      const pillarsDoc = await planningRepository.getDoc<PillarsDoc>(userId, 'pillars');
      if (!pillarsDoc) return;

      const index = findItemIndex(pillarsDoc.data, pillarId);
      const patch = createUpdateItemPatch(index, {
        rating: avgRating,
        updatedAt: new Date().toISOString(),
      });
      await planningRepository.patchDoc<PillarsDoc>(
        userId,
        'pillars',
        patch,
        pillarsDoc.version
      );
    });
  }

  /**
   * Get pillar with all themes and tasks (for detail view)
   */
  async getPillarWithDetails(id: string, userId: string) {
    const pillar = await this.getPillar(id, userId);
    
    const themesDoc = await planningRepository.getDoc<ThemesDoc>(userId, 'themes');
    const pillarThemes = themesDoc?.data.filter((t) => t.pillarId === id) ?? [];

    // Note: We'll add tasks when we implement tasks service
    return {
      ...pillar,
      themes: pillarThemes,
      tasks: [], // Placeholder
    };
  }
}

// Export singleton instance
export const pillarsServiceV2 = new PillarsServiceV2();

