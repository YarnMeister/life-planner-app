import { describe, it, expect } from 'vitest';
import { computeTaskCounts } from './taskUtils';
import type { Task, Pillar } from '@/types';

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
});

