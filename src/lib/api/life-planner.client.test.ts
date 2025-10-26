/**
 * Tests for Life Planner API Client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pillarsAPI, themesAPI, tasksAPI, APIError } from './life-planner.client';

// Mock fetch
global.fetch = vi.fn();

describe('Life Planner API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('APIError', () => {
    it('should create an APIError with status and message', () => {
      const error = new APIError(404, undefined, 'Not found');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
    });

    it('should create an APIError with details', () => {
      const details = { field: 'name', message: 'Required' };
      const error = new APIError(400, details);
      expect(error.details).toEqual(details);
    });
  });

  describe('Pillars API', () => {
    it('should get all pillars', async () => {
      const mockPillars = [
        { id: 'p1', name: 'Health', color: '#7C3AED', domain: 'personal', avgPercent: 50 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPillars }),
      } as Response);

      const result = await pillarsAPI.getAll();
      expect(result).toEqual(mockPillars);
      expect(global.fetch).toHaveBeenCalledWith('/api/life-planner/pillars');
    });

    it('should create a pillar', async () => {
      const newPillar = { name: 'Test', color: '#000000', domain: 'personal' as const };
      const mockResponse = { id: 'p1', ...newPillar, avgPercent: 0 };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await pillarsAPI.create(newPillar);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/pillars',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should update a pillar', async () => {
      const updates = { name: 'Updated' };
      const mockResponse = { id: 'p1', name: 'Updated', color: '#000000', domain: 'personal' as const, avgPercent: 0 };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await pillarsAPI.update('p1', updates);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/pillars/p1',
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should delete a pillar', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await pillarsAPI.delete('p1');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/pillars/p1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should handle API errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      } as Response);

      await expect(pillarsAPI.getAll()).rejects.toThrow(APIError);
    });
  });

  describe('Themes API', () => {
    it('should get all themes', async () => {
      const mockThemes = [
        { id: 't1', pillarId: 'p1', name: 'Body', ratingPercent: 50 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockThemes }),
      } as Response);

      const result = await themesAPI.getAll();
      expect(result).toEqual(mockThemes);
    });

    it('should get themes by pillar', async () => {
      const mockThemes = [
        { id: 't1', pillarId: 'p1', name: 'Body', ratingPercent: 50 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockThemes }),
      } as Response);

      const result = await themesAPI.getAll('p1');
      expect(result).toEqual(mockThemes);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('pillarId=p1')
      );
    });

    it('should create a theme', async () => {
      const newTheme = { pillarId: 'p1', name: 'Test', ratingPercent: 50 };
      const mockResponse = { id: 't1', ...newTheme };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await themesAPI.create(newTheme);
      expect(result).toEqual(mockResponse);
    });

    it('should update a theme', async () => {
      const updates = { name: 'Updated', ratingPercent: 75 };
      const mockResponse = { id: 't1', pillarId: 'p1', ...updates };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await themesAPI.update('t1', updates);
      expect(result).toEqual(mockResponse);
    });

    it('should delete a theme', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await themesAPI.delete('t1');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/themes/t1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Tasks API', () => {
    it('should get all tasks', async () => {
      const mockTasks = [
        { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Test', status: 'open' as const, rank: 0 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks }),
      } as Response);

      const result = await tasksAPI.getAll();
      expect(result).toEqual(mockTasks);
    });

    it('should get tasks by theme', async () => {
      const mockTasks = [
        { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Test', status: 'open' as const, rank: 0 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks }),
      } as Response);

      const result = await tasksAPI.getAll('t1');
      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('themeId=t1')
      );
    });

    it('should get tasks by status', async () => {
      const mockTasks = [
        { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Test', status: 'open' as const, rank: 0 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks }),
      } as Response);

      const result = await tasksAPI.getAll(undefined, 'open');
      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=open')
      );
    });

    it('should create a task', async () => {
      const newTask = { pillarId: 'p1', themeId: 't1', title: 'Test', status: 'open' as const, rank: 0 };
      const mockResponse = { id: 'task1', ...newTask };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await tasksAPI.create(newTask);
      expect(result).toEqual(mockResponse);
    });

    it('should update a task', async () => {
      const updates = { title: 'Updated', status: 'done' as const };
      const mockResponse = { id: 'task1', pillarId: 'p1', themeId: 't1', ...updates, rank: 0 };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await tasksAPI.update('task1', updates);
      expect(result).toEqual(mockResponse);
    });

    it('should delete a task', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await tasksAPI.delete('task1');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/tasks/task1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should reorder tasks', async () => {
      const mockTasks = [
        { id: 'task2', pillarId: 'p1', themeId: 't1', title: 'Task 2', status: 'open' as const, rank: 0 },
        { id: 'task1', pillarId: 'p1', themeId: 't1', title: 'Task 1', status: 'open' as const, rank: 1 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks }),
      } as Response);

      const result = await tasksAPI.reorder('t1', ['task2', 'task1']);
      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/life-planner/tasks/reorder',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ themeId: 't1', taskIds: ['task2', 'task1'] }),
        })
      );
    });
  });
});

