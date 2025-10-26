/**
 * Pillars Service
 * Handles all pillar-related business logic
 */

import { eq, and } from 'drizzle-orm';
import { pillars, themes, tasks } from '@/drizzle/schema';
import { BaseService, NotFoundError, ValidationError } from './base.service';

export interface CreatePillarInput {
  name: string;
  color: string;
  domain: 'work' | 'personal';
}

export interface UpdatePillarInput {
  name?: string;
  color?: string;
  domain?: 'work' | 'personal';
}

export class PillarsService extends BaseService {
  /**
   * Get all pillars for a user
   */
  async getPillars(userId: string) {
    return this.db.query.pillars.findMany({
      where: eq(pillars.userId, userId),
      orderBy: (pillars, { asc }) => [asc(pillars.createdAt)],
    });
  }

  /**
   * Get a single pillar by ID
   */
  async getPillar(id: string, userId: string) {
    const pillar = await this.db.query.pillars.findFirst({
      where: and(eq(pillars.id, id), eq(pillars.userId, userId)),
    });

    this.verifyExists(pillar, 'Pillar');
    return pillar;
  }

  /**
   * Create a new pillar
   */
  async createPillar(input: CreatePillarInput, userId: string) {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError('Pillar name is required');
    }
    if (!input.color || input.color.trim().length === 0) {
      throw new ValidationError('Pillar color is required');
    }
    if (!['work', 'personal'].includes(input.domain)) {
      throw new ValidationError('Invalid pillar domain');
    }

    const result = await this.db
      .insert(pillars)
      .values({
        userId,
        name: input.name.trim(),
        color: input.color.trim(),
        domain: input.domain,
        avgPercent: 0,
      })
      .returning();

    return result[0];
  }

  /**
   * Update a pillar
   */
  async updatePillar(id: string, input: UpdatePillarInput, userId: string) {
    // Verify ownership
    const pillar = await this.getPillar(id, userId);

    // Validate input
    if (input.name !== undefined && input.name.trim().length === 0) {
      throw new ValidationError('Pillar name cannot be empty');
    }
    if (input.color !== undefined && input.color.trim().length === 0) {
      throw new ValidationError('Pillar color cannot be empty');
    }
    if (input.domain !== undefined && !['work', 'personal'].includes(input.domain)) {
      throw new ValidationError('Invalid pillar domain');
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.color !== undefined) updateData.color = input.color.trim();
    if (input.domain !== undefined) updateData.domain = input.domain;
    updateData.updatedAt = new Date();

    const result = await this.db
      .update(pillars)
      .set(updateData)
      .where(eq(pillars.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a pillar and all associated themes and tasks
   */
  async deletePillar(id: string, userId: string) {
    // Verify ownership
    await this.getPillar(id, userId);

    // Delete pillar (cascade will handle themes and tasks)
    await this.db.delete(pillars).where(eq(pillars.id, id));
  }

  /**
   * Recalculate average percent for a pillar based on its themes
   */
  async recalculateAverage(id: string, userId: string) {
    // Verify ownership
    const pillar = await this.getPillar(id, userId);

    // Get all themes for this pillar
    const pillarThemes = await this.db.query.themes.findMany({
      where: eq(themes.pillarId, id),
    });

    // Calculate average
    const avgPercent =
      pillarThemes.length > 0
        ? Math.round(
            pillarThemes.reduce((sum, t) => sum + t.ratingPercent, 0) /
              pillarThemes.length
          )
        : 0;

    // Update pillar
    const result = await this.db
      .update(pillars)
      .set({
        avgPercent,
        updatedAt: new Date(),
      })
      .where(eq(pillars.id, id))
      .returning();

    return result[0];
  }

  /**
   * Get pillar with all themes and tasks
   */
  async getPillarWithDetails(id: string, userId: string) {
    const pillar = await this.getPillar(id, userId);

    const pillarThemes = await this.db.query.themes.findMany({
      where: eq(themes.pillarId, id),
    });

    const pillarTasks = await this.db.query.tasks.findMany({
      where: eq(tasks.pillarId, id),
    });

    return {
      ...pillar,
      themes: pillarThemes,
      tasks: pillarTasks,
    };
  }
}

// Export singleton instance
export const pillarsService = new PillarsService();

