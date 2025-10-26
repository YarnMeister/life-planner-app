/**
 * Tasks Service
 * Handles all task-related business logic
 */

import { eq, and } from 'drizzle-orm';
import { tasks } from '@/drizzle/schema';
import { BaseService, ValidationError } from './base.service';
import { themesService } from './themes.service';

export interface CreateTaskInput {
  pillarId: string;
  themeId: string;
  title: string;
  description?: string;
  timeEstimate?: '15m' | '30m' | '1h' | '2h+';
  impact?: 'H' | 'M' | 'L';
  status?: 'open' | 'done';
  dueDate?: string;
  notes?: string;
  taskType?: 'adhoc' | 'recurring';
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  timeEstimate?: '15m' | '30m' | '1h' | '2h+';
  impact?: 'H' | 'M' | 'L';
  status?: 'open' | 'done';
  dueDate?: string;
  notes?: string;
  taskType?: 'adhoc' | 'recurring';
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
}

export class TasksService extends BaseService {
  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string) {
    return this.db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    });
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string, userId: string) {
    const task = await this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
    });

    this.verifyExists(task, 'Task');
    return task;
  }

  /**
   * Get tasks by theme
   */
  async getTasksByTheme(themeId: string, userId: string) {
    return this.db.query.tasks.findMany({
      where: and(eq(tasks.themeId, themeId), eq(tasks.userId, userId)),
      orderBy: (tasks, { asc }) => [asc(tasks.rank)],
    });
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput, userId: string) {
    // Validate input
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError('Task title is required');
    }

    // Verify theme exists and belongs to user
    await themesService.getTheme(input.themeId, userId);

    // Get current max rank for this theme
    const themeTasks = await this.getTasksByTheme(input.themeId, userId);
    const maxRank = themeTasks.length > 0 ? Math.max(...themeTasks.map(t => t.rank)) : -1;

    const result = await this.db
      .insert(tasks)
      .values({
        userId,
        pillarId: input.pillarId,
        themeId: input.themeId,
        title: input.title.trim(),
        description: input.description,
        timeEstimate: input.timeEstimate,
        impact: input.impact,
        status: input.status ?? 'open',
        dueDate: input.dueDate,
        rank: maxRank + 1,
        notes: input.notes,
        taskType: input.taskType ?? 'adhoc',
        recurrenceFrequency: input.recurrenceFrequency,
        recurrenceInterval: input.recurrenceInterval,
      })
      .returning();

    return result[0];
  }

  /**
   * Update a task
   */
  async updateTask(id: string, input: UpdateTaskInput, userId: string) {
    // Verify ownership
    const task = await this.getTask(id, userId);

    // Validate input
    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new ValidationError('Task title cannot be empty');
    }

    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined) updateData.description = input.description;
    if (input.timeEstimate !== undefined) updateData.timeEstimate = input.timeEstimate;
    if (input.impact !== undefined) updateData.impact = input.impact;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.taskType !== undefined) updateData.taskType = input.taskType;
    if (input.recurrenceFrequency !== undefined) updateData.recurrenceFrequency = input.recurrenceFrequency;
    if (input.recurrenceInterval !== undefined) updateData.recurrenceInterval = input.recurrenceInterval;
    updateData.updatedAt = new Date();

    const result = await this.db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string, userId: string) {
    // Verify ownership
    await this.getTask(id, userId);

    // Delete task
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }

  /**
   * Reorder tasks within a theme
   */
  async reorderTasks(themeId: string, taskIds: string[], userId: string) {
    // Verify theme exists
    await themesService.getTheme(themeId, userId);

    // Update rank for each task
    for (let i = 0; i < taskIds.length; i++) {
      const taskId = taskIds[i];
      
      // Verify task belongs to user and theme
      const task = await this.getTask(taskId, userId);
      if (task.themeId !== themeId) {
        throw new ValidationError(`Task ${taskId} does not belong to theme ${themeId}`);
      }

      await this.db
        .update(tasks)
        .set({
          rank: i,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId));
    }

    // Return updated tasks
    return this.getTasksByTheme(themeId, userId);
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status: 'open' | 'done', userId: string) {
    return this.db.query.tasks.findMany({
      where: and(eq(tasks.status, status), eq(tasks.userId, userId)),
      orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    });
  }
}

// Export singleton instance
export const tasksService = new TasksService();

