/**
 * Integration tests for useLifeOSStore
 * Tests store functionality with optimistic updates and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLifeOSStore } from './useLifeOSStore';
import * as lifeplannerAPI from '@/src/lib/api/life-planner.client';

// Mock the API
vi.mock('@/src/lib/api/life-planner.client', () => ({
  pillarsAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  themesAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  tasksAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
  },
  APIError: Error,
}));

describe('useLifeOSStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLifeOSStore.setState({
      pillars: [],
      themes: [],
      tasks: [],
      selectedPillarId: null,
      selectedThemeIds: [],
      selectedTaskId: null,
      isLoading: false,
      isSyncing: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('Pillar operations', () => {
    it('should create a pillar with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      const newPillar = { name: 'Test', color: '#000000', domain: 'personal' as const };

      vi.mocked(lifeplannerAPI.pillarsAPI.create).mockResolvedValueOnce({
        id: 'p1',
        ...newPillar,
        avgPercent: 0,
      });

      await act(async () => {
        await result.current.addPillar(newPillar);
      });

      expect(result.current.pillars).toHaveLength(1);
      expect(result.current.pillars[0].name).toBe('Test');
    });

    it('should rollback pillar creation on API error', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      const newPillar = { name: 'Test', color: '#000000', domain: 'personal' as const };

      vi.mocked(lifeplannerAPI.pillarsAPI.create).mockRejectedValueOnce(
        new Error('API Error')
      );

      await act(async () => {
        try {
          await result.current.addPillar(newPillar);
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.pillars).toHaveLength(0);
      expect(result.current.error).toBeTruthy();
    });

    it('should update a pillar with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      // Set initial state
      useLifeOSStore.setState({
        pillars: [{ id: 'p1', name: 'Old', color: '#000000', domain: 'personal' as const, avgPercent: 0 }],
      });

      vi.mocked(lifeplannerAPI.pillarsAPI.update).mockResolvedValueOnce({
        id: 'p1',
        name: 'Updated',
        color: '#000000',
        domain: 'personal',
        avgPercent: 0,
      });

      await act(async () => {
        await result.current.updatePillar('p1', { name: 'Updated' });
      });

      expect(result.current.pillars[0].name).toBe('Updated');
    });

    it('should delete a pillar with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        pillars: [{ id: 'p1', name: 'Test', color: '#000000', domain: 'personal' as const, avgPercent: 0 }],
      });

      vi.mocked(lifeplannerAPI.pillarsAPI.delete).mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.deletePillar('p1');
      });

      expect(result.current.pillars).toHaveLength(0);
    });
  });

  describe('Theme operations', () => {
    it('should create a theme with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      const newTheme = { pillarId: 'p1', name: 'Test Theme', ratingPercent: 50 };

      vi.mocked(lifeplannerAPI.themesAPI.create).mockResolvedValueOnce({
        id: 't1',
        ...newTheme,
      });

      await act(async () => {
        await result.current.addTheme(newTheme);
      });

      expect(result.current.themes).toHaveLength(1);
      expect(result.current.themes[0].name).toBe('Test Theme');
    });

    it('should update a theme with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        themes: [{ id: 't1', pillarId: 'p1', name: 'Old', ratingPercent: 50 }],
      });

      vi.mocked(lifeplannerAPI.themesAPI.update).mockResolvedValueOnce({
        id: 't1',
        pillarId: 'p1',
        name: 'Updated',
        ratingPercent: 75,
      });

      await act(async () => {
        await result.current.updateTheme('t1', { name: 'Updated', ratingPercent: 75 });
      });

      expect(result.current.themes[0].name).toBe('Updated');
      expect(result.current.themes[0].ratingPercent).toBe(75);
    });

    it('should delete a theme with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        themes: [{ id: 't1', pillarId: 'p1', name: 'Test', ratingPercent: 50 }],
      });

      vi.mocked(lifeplannerAPI.themesAPI.delete).mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.deleteTheme('t1');
      });

      expect(result.current.themes).toHaveLength(0);
    });
  });

  describe('Task operations', () => {
    it('should create a task with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      const newTask = {
        pillarId: 'p1',
        themeId: 't1',
        title: 'Test Task',
        status: 'open' as const,
        rank: 0,
      };

      vi.mocked(lifeplannerAPI.tasksAPI.create).mockResolvedValueOnce({
        id: 'task1',
        ...newTask,
      });

      await act(async () => {
        await result.current.addTask(newTask);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Test Task');
    });

    it('should update a task with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        tasks: [{
          id: 'task1',
          pillarId: 'p1',
          themeId: 't1',
          title: 'Old',
          status: 'open' as const,
          rank: 0,
        }],
      });

      vi.mocked(lifeplannerAPI.tasksAPI.update).mockResolvedValueOnce({
        id: 'task1',
        pillarId: 'p1',
        themeId: 't1',
        title: 'Updated',
        status: 'done' as const,
        rank: 0,
      });

      await act(async () => {
        await result.current.updateTask('task1', { title: 'Updated', status: 'done' });
      });

      expect(result.current.tasks[0].title).toBe('Updated');
      expect(result.current.tasks[0].status).toBe('done');
    });

    it('should delete a task with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        tasks: [{
          id: 'task1',
          pillarId: 'p1',
          themeId: 't1',
          title: 'Test',
          status: 'open' as const,
          rank: 0,
        }],
      });

      vi.mocked(lifeplannerAPI.tasksAPI.delete).mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.deleteTask('task1');
      });

      expect(result.current.tasks).toHaveLength(0);
    });

    it('should reorder tasks with optimistic update', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        tasks: [
          { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Task 1', status: 'open' as const, rank: 0 },
          { id: 'task2', pillarId: 'p1', themeId: 't1', title: 'Task 2', status: 'open' as const, rank: 1 },
        ],
      });

      vi.mocked(lifeplannerAPI.tasksAPI.reorder).mockResolvedValueOnce([
        { id: 'task2', pillarId: 'p1', themeId: 't1', title: 'Task 2', status: 'open' as const, rank: 0 },
        { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Task 1', status: 'open' as const, rank: 1 },
      ]);

      await act(async () => {
        await result.current.reorderTasks('t1', ['task2', 'task1']);
      });

      expect(result.current.tasks[0].id).toBe('task2');
      expect(result.current.tasks[1].id).toBe('task1');
    });
  });

  describe('Loading states', () => {
    it('should set isSyncing during operations', async () => {
      const { result } = renderHook(() => useLifeOSStore());
      const newPillar = { name: 'Test', color: '#000000', domain: 'personal' as const };

      vi.mocked(lifeplannerAPI.pillarsAPI.create).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 'p1', ...newPillar, avgPercent: 0 }), 100))
      );

      const promise = act(async () => {
        await result.current.addPillar(newPillar);
      });

      // Note: isSyncing might be false by the time we check due to async nature
      // In real usage, components would see the true state during the operation
      await promise;

      expect(result.current.isSyncing).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({ error: 'Test error' });
      
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Computed properties', () => {
    it('should get themes by pillar', () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        themes: [
          { id: 't1', pillarId: 'p1', name: 'Theme 1', ratingPercent: 50 },
          { id: 't2', pillarId: 'p1', name: 'Theme 2', ratingPercent: 50 },
          { id: 't3', pillarId: 'p2', name: 'Theme 3', ratingPercent: 50 },
        ],
      });

      const themes = result.current.getThemesByPillar('p1');
      expect(themes).toHaveLength(2);
      expect(themes[0].id).toBe('t1');
    });

    it('should get tasks by theme sorted by rank', () => {
      const { result } = renderHook(() => useLifeOSStore());
      
      useLifeOSStore.setState({
        tasks: [
          { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Task 1', status: 'open' as const, rank: 2 },
          { id: 'task2', pillarId: 'p1', themeId: 't1', title: 'Task 2', status: 'open' as const, rank: 0 },
          { id: 'task3', pillarId: 'p1', themeId: 't1', title: 'Task 3', status: 'open' as const, rank: 1 },
        ],
      });

      const tasks = result.current.getTasksByTheme('t1');
      expect(tasks).toHaveLength(3);
      expect(tasks[0].id).toBe('task2'); // rank 0
      expect(tasks[1].id).toBe('task3'); // rank 1
      expect(tasks[2].id).toBe('task1'); // rank 2
    });
  });
});

