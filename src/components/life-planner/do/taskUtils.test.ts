import { describe, it, expect } from 'vitest';
import { computeTaskCounts, compareTaskPriority, prioritizeTasks } from './taskUtils';
import type { Task, Pillar, Theme } from '@/types';

describe('taskUtils', () => {
  describe('computeTaskCounts', () => {
    const mockPillars: Pillar[] = [
      {
        id: 'pillar-1',
        name: 'Health',
        color: '#7C3AED',
        domain: 'personal',
        rating: 75,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'pillar-2',
        name: 'Career',
        color: '#3B82F6',
        domain: 'work',
        rating: 80,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    it('should count tasks by domain correctly', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Personal task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-2',
          pillarId: 'pillar-2',
          title: 'Work task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Another personal task',
          status: 'doing',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const counts = computeTaskCounts(tasks, mockPillars);

      expect(counts).toEqual({
        all: 3,
        work: 1,
        personal: 2,
      });
    });

    it('should exclude completed tasks', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Active task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-2',
          pillarId: 'pillar-2',
          title: 'Completed task',
          status: 'done',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const counts = computeTaskCounts(tasks, mockPillars);

      expect(counts).toEqual({
        all: 1,
        work: 0,
        personal: 1,
      });
    });

    it('should exclude archived tasks', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Active task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-2',
          pillarId: 'pillar-2',
          title: 'Archived task',
          status: 'archived',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const counts = computeTaskCounts(tasks, mockPillars);

      expect(counts).toEqual({
        all: 1,
        work: 0,
        personal: 1,
      });
    });

    it('should handle tasks without pillarId', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          title: 'Task without pillar',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const counts = computeTaskCounts(tasks, mockPillars);

      expect(counts).toEqual({
        all: 1,
        work: 0,
        personal: 0,
      });
    });

    it('should return zero counts for empty task list', () => {
      const counts = computeTaskCounts([], mockPillars);

      expect(counts).toEqual({
        all: 0,
        work: 0,
        personal: 0,
      });
    });
  });

  describe('compareTaskPriority', () => {
    const themeRatingMap = new Map([
      ['theme-1', 50],
      ['theme-2', 75],
      ['theme-3', 25],
    ]);

    it('should prioritize task with lower theme rating', () => {
      const taskA: Task = {
        id: 'task-1',
        themeId: 'theme-2', // rating 75
        title: 'Task A',
        status: 'todo',
        taskType: 'adhoc',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const taskB: Task = {
        id: 'task-2',
        themeId: 'theme-3', // rating 25
        title: 'Task B',
        status: 'todo',
        taskType: 'adhoc',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = compareTaskPriority(taskA, taskB, themeRatingMap);
      expect(result).toBeGreaterThan(0); // taskA (75) > taskB (25), so taskB should come first
    });

    it('should use rank as tiebreaker when theme ratings are equal', () => {
      const taskA: Task = {
        id: 'task-1',
        themeId: 'theme-1',
        title: 'Task A',
        status: 'todo',
        taskType: 'adhoc',
        rank: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const taskB: Task = {
        id: 'task-2',
        themeId: 'theme-1',
        title: 'Task B',
        status: 'todo',
        taskType: 'adhoc',
        rank: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = compareTaskPriority(taskA, taskB, themeRatingMap);
      expect(result).toBeGreaterThan(0); // taskA (rank 5) > taskB (rank 2), so taskB should come first
    });

    it('should use impact as final tiebreaker', () => {
      const taskA: Task = {
        id: 'task-1',
        themeId: 'theme-1',
        title: 'Task A',
        status: 'todo',
        taskType: 'adhoc',
        rank: 1,
        impact: 'M',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const taskB: Task = {
        id: 'task-2',
        themeId: 'theme-1',
        title: 'Task B',
        status: 'todo',
        taskType: 'adhoc',
        rank: 1,
        impact: 'H',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = compareTaskPriority(taskA, taskB, themeRatingMap);
      expect(result).toBeGreaterThan(0); // taskA (M) > taskB (H), so taskB should come first
    });

    it('should handle missing theme rating with default value', () => {
      const taskA: Task = {
        id: 'task-1',
        themeId: 'unknown-theme',
        title: 'Task A',
        status: 'todo',
        taskType: 'adhoc',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const taskB: Task = {
        id: 'task-2',
        themeId: 'theme-1', // rating 50
        title: 'Task B',
        status: 'todo',
        taskType: 'adhoc',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = compareTaskPriority(taskA, taskB, themeRatingMap);
      expect(result).toBeGreaterThan(0); // taskA (100 default) > taskB (50)
    });

    it('should handle missing rank with default value', () => {
      const taskA: Task = {
        id: 'task-1',
        themeId: 'theme-1',
        title: 'Task A',
        status: 'todo',
        taskType: 'adhoc',
        // no rank
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const taskB: Task = {
        id: 'task-2',
        themeId: 'theme-1',
        title: 'Task B',
        status: 'todo',
        taskType: 'adhoc',
        rank: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = compareTaskPriority(taskA, taskB, themeRatingMap);
      expect(result).toBeGreaterThan(0); // taskA (999 default) > taskB (5)
    });
  });

  describe('prioritizeTasks', () => {
    const mockPillars: Pillar[] = [
      {
        id: 'pillar-1',
        name: 'Health',
        color: '#7C3AED',
        domain: 'personal',
        rating: 75,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'pillar-2',
        name: 'Career',
        color: '#3B82F6',
        domain: 'work',
        rating: 80,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockThemes: Theme[] = [
      {
        id: 'theme-1',
        pillarId: 'pillar-1',
        name: 'Fitness',
        rating: 50,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'theme-2',
        pillarId: 'pillar-2',
        name: 'Projects',
        rating: 75,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'theme-3',
        pillarId: 'pillar-1',
        name: 'Nutrition',
        rating: 25,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    it('should filter tasks by domain', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Personal task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-2',
          pillarId: 'pillar-2',
          title: 'Work task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const workTasks = prioritizeTasks(tasks, mockThemes, mockPillars, 'work');
      expect(workTasks).toHaveLength(1);
      expect(workTasks[0].id).toBe('task-2');

      const personalTasks = prioritizeTasks(tasks, mockThemes, mockPillars, 'personal');
      expect(personalTasks).toHaveLength(1);
      expect(personalTasks[0].id).toBe('task-1');

      const allTasks = prioritizeTasks(tasks, mockThemes, mockPillars, 'all');
      expect(allTasks).toHaveLength(2);
    });

    it('should exclude completed and archived tasks', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Active task',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Completed task',
          status: 'done',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Archived task',
          status: 'archived',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const result = prioritizeTasks(tasks, mockThemes, mockPillars, 'all');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('task-1');
    });

    it('should sort tasks by theme rating (ascending)', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-2', // rating 75
          pillarId: 'pillar-2',
          title: 'Medium priority',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-3', // rating 25
          pillarId: 'pillar-1',
          title: 'High priority',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          themeId: 'theme-1', // rating 50
          pillarId: 'pillar-1',
          title: 'Medium-high priority',
          status: 'todo',
          taskType: 'adhoc',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const result = prioritizeTasks(tasks, mockThemes, mockPillars, 'all');
      expect(result.map((t) => t.id)).toEqual(['task-2', 'task-3', 'task-1']);
    });

    it('should use rank as tiebreaker for same theme rating', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 1',
          status: 'todo',
          taskType: 'adhoc',
          rank: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 2',
          status: 'todo',
          taskType: 'adhoc',
          rank: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 3',
          status: 'todo',
          taskType: 'adhoc',
          rank: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const result = prioritizeTasks(tasks, mockThemes, mockPillars, 'all');
      expect(result.map((t) => t.id)).toEqual(['task-2', 'task-3', 'task-1']);
    });

    it('should use impact as final tiebreaker (H > M > L)', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 1',
          status: 'todo',
          taskType: 'adhoc',
          rank: 1,
          impact: 'L',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-2',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 2',
          status: 'todo',
          taskType: 'adhoc',
          rank: 1,
          impact: 'H',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'task-3',
          themeId: 'theme-1',
          pillarId: 'pillar-1',
          title: 'Task 3',
          status: 'todo',
          taskType: 'adhoc',
          rank: 1,
          impact: 'M',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const result = prioritizeTasks(tasks, mockThemes, mockPillars, 'all');
      expect(result.map((t) => t.id)).toEqual(['task-2', 'task-3', 'task-1']);
    });
  });
});

