/**
 * Custom hook for Life OS store with better error handling
 * Provides a cleaner API for components
 */

import { useCallback } from 'react';
import { useLifeOSStore } from '@/store/useLifeOSStore';
import { Pillar, Theme, Task } from '@/types';

export function useLifeOS() {
  const store = useLifeOSStore();

  // Pillar operations
  const createPillar = useCallback(
    async (pillar: Omit<Pillar, 'id' | 'avgPercent'>) => {
      try {
        return await store.addPillar(pillar);
      } catch (error) {
        console.error('Failed to create pillar:', error);
        throw error;
      }
    },
    [store]
  );

  const updatePillar = useCallback(
    async (id: string, updates: Partial<Pillar>) => {
      try {
        return await store.updatePillar(id, updates);
      } catch (error) {
        console.error('Failed to update pillar:', error);
        throw error;
      }
    },
    [store]
  );

  const removePillar = useCallback(
    async (id: string) => {
      try {
        await store.deletePillar(id);
      } catch (error) {
        console.error('Failed to delete pillar:', error);
        throw error;
      }
    },
    [store]
  );

  // Theme operations
  const createTheme = useCallback(
    async (theme: Omit<Theme, 'id'>) => {
      try {
        return await store.addTheme(theme);
      } catch (error) {
        console.error('Failed to create theme:', error);
        throw error;
      }
    },
    [store]
  );

  const updateTheme = useCallback(
    async (id: string, updates: Partial<Theme>) => {
      try {
        return await store.updateTheme(id, updates);
      } catch (error) {
        console.error('Failed to update theme:', error);
        throw error;
      }
    },
    [store]
  );

  const removeTheme = useCallback(
    async (id: string) => {
      try {
        await store.deleteTheme(id);
      } catch (error) {
        console.error('Failed to delete theme:', error);
        throw error;
      }
    },
    [store]
  );

  // Task operations
  const createTask = useCallback(
    async (task: Omit<Task, 'id'>) => {
      try {
        return await store.addTask(task);
      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      }
    },
    [store]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        return await store.updateTask(id, updates);
      } catch (error) {
        console.error('Failed to update task:', error);
        throw error;
      }
    },
    [store]
  );

  const removeTask = useCallback(
    async (id: string) => {
      try {
        await store.deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        throw error;
      }
    },
    [store]
  );

  const reorderTasksInTheme = useCallback(
    async (themeId: string, taskIds: string[]) => {
      try {
        return await store.reorderTasks(themeId, taskIds);
      } catch (error) {
        console.error('Failed to reorder tasks:', error);
        throw error;
      }
    },
    [store]
  );

  // Data fetching
  const loadPillars = useCallback(async () => {
    try {
      await store.fetchPillars();
    } catch (error) {
      console.error('Failed to load pillars:', error);
    }
  }, [store]);

  const loadThemes = useCallback(
    async (pillarId?: string) => {
      try {
        await store.fetchThemes(pillarId);
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    },
    [store]
  );

  const loadTasks = useCallback(
    async (themeId?: string, status?: 'open' | 'done') => {
      try {
        await store.fetchTasks(themeId, status);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    },
    [store]
  );

  return {
    // Data
    pillars: store.pillars,
    themes: store.themes,
    tasks: store.tasks,
    selectedPillarId: store.selectedPillarId,
    selectedThemeIds: store.selectedThemeIds,
    selectedTaskId: store.selectedTaskId,

    // Loading states
    isLoading: store.isLoading,
    isSyncing: store.isSyncing,
    error: store.error,

    // Pillar operations
    createPillar,
    updatePillar,
    removePillar,
    selectPillar: store.selectPillar,

    // Theme operations
    createTheme,
    updateTheme,
    removeTheme,
    toggleThemeSelection: store.toggleThemeSelection,
    selectSingleTheme: store.selectSingleTheme,

    // Task operations
    createTask,
    updateTask,
    removeTask,
    selectTask: store.selectTask,
    reorderTasksInTheme,

    // Data fetching
    loadPillars,
    loadThemes,
    loadTasks,

    // Computed
    getThemesByPillar: store.getThemesByPillar,
    getTasksByTheme: store.getTasksByTheme,
    recalculatePillarAverage: store.recalculatePillarAverage,

    // Error handling
    clearError: store.clearError,
  };
}

