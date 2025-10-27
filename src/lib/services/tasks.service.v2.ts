import { planningRepository } from '@/lib/repositories/planning.repository';
import { Task, TasksDoc, ThemesDoc, TaskStatus, TaskType, TimeEstimate, Impact } from '@/types/planning.types';
import { 
  findItemIndex, 
  createAddItemPatch, 
  createUpdateItemPatch, 
  createRemoveItemPatch 
} from '@/lib/utils/json-patch.utils';
import { v4 as uuidv4 } from 'uuid';
import { themesServiceV2 } from './themes.service.v2';

export interface CreateTaskInput {
  themeId: string;
  title: string;
  description?: string;
  notes?: string;
  status?: TaskStatus;
  taskType?: TaskType;
  priority?: number;
  impact?: Impact;
  timeEstimate?: TimeEstimate;
  effort?: number;
  tags?: string[];
  ratingImpact?: number;
  rank?: number;
  dueDate?: string;
  dueAt?: string;
  recurrence?: {
    rule: string;
    until?: string;
  };
  recurrenceFrequency?: string;
  recurrenceInterval?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  notes?: string;
  status?: TaskStatus;
  taskType?: TaskType;
  priority?: number;
  impact?: Impact;
  timeEstimate?: TimeEstimate;
  effort?: number;
  tags?: string[];
  ratingImpact?: number;
  rank?: number;
  dueDate?: string;
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  recurrence?: {
    rule: string;
    until?: string;
  };
  recurrenceFrequency?: string;
  recurrenceInterval?: number;
}

export class TasksServiceV2 {
  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string): Promise<Task[]> {
    const doc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    return doc?.data ?? [];
  }

  /**
   * Get tasks by theme
   */
  async getTasksByTheme(themeId: string, userId: string): Promise<Task[]> {
    const tasks = await this.getTasks(userId);
    return tasks.filter((t) => t.themeId === themeId);
  }

  /**
   * Get tasks by pillar
   */
  async getTasksByPillar(pillarId: string, userId: string): Promise<Task[]> {
    const tasks = await this.getTasks(userId);
    return tasks.filter((t) => t.pillarId === pillarId);
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status: TaskStatus, userId: string): Promise<Task[]> {
    const tasks = await this.getTasks(userId);
    return tasks.filter((t) => t.status === status);
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string, userId: string): Promise<Task> {
    const tasks = await this.getTasks(userId);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput, userId: string): Promise<Task> {
    // Verify theme exists and get pillarId for denormalization
    const theme = await themesServiceV2.getTheme(input.themeId, userId);

    const doc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    if (!doc) {
      throw new Error('Tasks document not initialized');
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      themeId: input.themeId,
      pillarId: theme.pillarId, // Denormalize for fast filtering
      title: input.title.trim(),
      description: input.description,
      notes: input.notes,
      status: input.status ?? 'todo',
      taskType: input.taskType ?? 'adhoc',
      priority: input.priority,
      impact: input.impact,
      timeEstimate: input.timeEstimate,
      effort: input.effort,
      tags: input.tags,
      ratingImpact: input.ratingImpact,
      rank: input.rank ?? doc.data.length,
      order: doc.data.length,
      dueDate: input.dueDate,
      dueAt: input.dueAt,
      recurrence: input.recurrence,
      recurrenceFrequency: input.recurrenceFrequency,
      recurrenceInterval: input.recurrenceInterval,
      createdAt: now,
      updatedAt: now,
    };

    // Use JSON Patch to add
    const patch = createAddItemPatch(newTask);
    await planningRepository.patchDoc<TasksDoc>(
      userId,
      'tasks',
      patch,
      doc.version
    );

    return newTask;
  }

  /**
   * Update a task
   */
  async updateTask(
    id: string,
    input: UpdateTaskInput,
    userId: string
  ): Promise<Task> {
    const doc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    if (!doc) {
      throw new Error('Tasks document not found');
    }

    const index = findItemIndex(doc.data, id);
    const task = doc.data[index];

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    // Copy all provided fields
    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.description !== undefined) updates.description = input.description;
    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.status !== undefined) {
      updates.status = input.status;
      // Auto-set timestamps based on status
      if (input.status === 'doing' && !task.startedAt) {
        updates.startedAt = new Date().toISOString();
      }
      if (input.status === 'done' && !task.completedAt) {
        updates.completedAt = new Date().toISOString();
      }
    }
    if (input.taskType !== undefined) updates.taskType = input.taskType;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.impact !== undefined) updates.impact = input.impact;
    if (input.timeEstimate !== undefined) updates.timeEstimate = input.timeEstimate;
    if (input.effort !== undefined) updates.effort = input.effort;
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.ratingImpact !== undefined) updates.ratingImpact = input.ratingImpact;
    if (input.rank !== undefined) updates.rank = input.rank;
    if (input.dueDate !== undefined) updates.dueDate = input.dueDate;
    if (input.dueAt !== undefined) updates.dueAt = input.dueAt;
    if (input.startedAt !== undefined) updates.startedAt = input.startedAt;
    if (input.completedAt !== undefined) updates.completedAt = input.completedAt;
    if (input.recurrence !== undefined) updates.recurrence = input.recurrence;
    if (input.recurrenceFrequency !== undefined) updates.recurrenceFrequency = input.recurrenceFrequency;
    if (input.recurrenceInterval !== undefined) updates.recurrenceInterval = input.recurrenceInterval;

    const patch = createUpdateItemPatch(index, updates);
    await planningRepository.patchDoc<TasksDoc>(
      userId,
      'tasks',
      patch,
      doc.version
    );

    return { ...task, ...updates } as Task;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string, userId: string): Promise<void> {
    const doc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    if (!doc) {
      throw new Error('Tasks document not found');
    }

    const index = findItemIndex(doc.data, id);
    const patch = createRemoveItemPatch(index);
    await planningRepository.patchDoc<TasksDoc>(
      userId,
      'tasks',
      patch,
      doc.version
    );
  }

  /**
   * Reorder tasks within a theme
   */
  async reorderTasks(themeId: string, taskIds: string[], userId: string): Promise<Task[]> {
    const doc = await planningRepository.getDoc<TasksDoc>(userId, 'tasks');
    if (!doc) {
      throw new Error('Tasks document not found');
    }

    // Build patches to update rank for each task
    const patches = taskIds.map((taskId, newRank) => {
      const index = findItemIndex(doc.data, taskId);
      return createUpdateItemPatch(index, { 
        rank: newRank,
        updatedAt: new Date().toISOString(),
      });
    }).flat();

    await planningRepository.patchDoc<TasksDoc>(
      userId,
      'tasks',
      patches,
      doc.version
    );

    // Return updated tasks
    return this.getTasksByTheme(themeId, userId);
  }
}

// Export singleton instance
export const tasksServiceV2 = new TasksServiceV2();

