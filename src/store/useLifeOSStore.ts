import { create } from 'zustand';
import { Pillar, Theme, Task, TaskStatus } from '@/types';
import { pillarsAPI, themesAPI, tasksAPI, APIError } from '../lib/api/life-planner.client';

interface LifeOSState {
  // Data
  pillars: Pillar[];
  themes: Theme[];
  tasks: Task[];
  selectedPillarId: string | null;
  selectedThemeIds: string[];
  selectedTaskId: string | null;

  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Pillar actions
  addPillar: (pillar: Omit<Pillar, 'id' | 'rating' | 'createdAt' | 'updatedAt'>) => Promise<Pillar>;
  updatePillar: (id: string, updates: Partial<Pillar>) => Promise<Pillar>;
  deletePillar: (id: string) => Promise<void>;
  selectPillar: (id: string | null) => void;

  // Theme actions
  addTheme: (theme: Omit<Theme, 'id' | 'rating' | 'createdAt' | 'updatedAt'>) => Promise<Theme>;
  updateTheme: (id: string, updates: Partial<Theme>) => Promise<Theme>;
  deleteTheme: (id: string) => Promise<void>;
  toggleThemeSelection: (id: string) => void;
  selectSingleTheme: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (id: string | null) => void;
  reorderTasks: (themeId: string, taskIds: string[]) => Promise<Task[]>;

  // Data fetching
  fetchPillars: () => Promise<void>;
  fetchThemes: (pillarId?: string) => Promise<void>;
  fetchTasks: (themeId?: string, pillarId?: string, status?: TaskStatus) => Promise<void>;

  // Computed
  getThemesByPillar: (pillarId: string) => Theme[];
  getTasksByTheme: (themeId: string) => Task[];
  recalculatePillarRating: (pillarId: string) => void;

  // Error handling
  clearError: () => set({ error: null }),
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useLifeOSStore = create<LifeOSState>((set, get) => ({
  // Initial state - data comes from API
  pillars: [],
  themes: [],
  tasks: [],
  selectedPillarId: null,
  selectedThemeIds: [],
  selectedTaskId: null,
  isLoading: false,
  isSyncing: false,
  error: null,

  // Error handling
  clearError: () => set({ error: null }),

  // Pillar actions with API integration
  addPillar: async (pillar) => {
    const optimisticPillar = { 
      ...pillar, 
      id: generateId(), 
      rating: 0, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } as Pillar;
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({ pillars: [...state.pillars, optimisticPillar] }));

      // API call
      const result = await pillarsAPI.create(pillar);
      
      // Replace optimistic with real data
      set((state) => ({
        pillars: state.pillars.map((p) => (p.id === optimisticPillar.id ? result : p)),
        isSyncing: false,
      }));
      
      return result;
    } catch (error) {
      // Rollback optimistic update
      set((state) => ({
        pillars: state.pillars.filter((p) => p.id !== optimisticPillar.id),
        error: error instanceof APIError ? error.message : 'Failed to add pillar',
        isSyncing: false,
      }));
      throw error;
    }
  },

  updatePillar: async (id, updates) => {
    const previousPillars = get().pillars;
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        pillars: state.pillars.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));

      // API call
      const result = await pillarsAPI.update(id, updates);
      
      // Replace with real data
      set((state) => ({
        pillars: state.pillars.map((p) => (p.id === id ? result : p)),
        isSyncing: false,
      }));
      
      return result;
    } catch (error) {
      // Rollback
      set({
        pillars: previousPillars,
        error: error instanceof APIError ? error.message : 'Failed to update pillar',
        isSyncing: false,
      });
      throw error;
    }
  },

  deletePillar: async (id) => {
    const previousPillars = get().pillars;
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        pillars: state.pillars.filter((p) => p.id !== id),
      }));

      // API call
      await pillarsAPI.delete(id);
      
      set({ isSyncing: false });
    } catch (error) {
      // Rollback
      set({
        pillars: previousPillars,
        error: error instanceof APIError ? error.message : 'Failed to delete pillar',
        isSyncing: false,
      });
      throw error;
    }
  },

  selectPillar: (id) => set({ selectedPillarId: id }),

  // Theme actions with API integration
  addTheme: async (theme) => {
    const optimisticTheme = { 
      ...theme, 
      id: generateId(), 
      rating: 0, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } as Theme;
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({ themes: [...state.themes, optimisticTheme] }));

      // API call
      const result = await themesAPI.create(theme);
      
      // Replace optimistic with real data
      set((state) => ({
        themes: state.themes.map((t) => (t.id === optimisticTheme.id ? result : t)),
        isSyncing: false,
      }));
      
      // Recalculate pillar rating
      get().recalculatePillarRating(theme.pillarId);
      
      return result;
    } catch (error) {
      // Rollback
      set((state) => ({
        themes: state.themes.filter((t) => t.id !== optimisticTheme.id),
        error: error instanceof APIError ? error.message : 'Failed to add theme',
        isSyncing: false,
      }));
      throw error;
    }
  },

  updateTheme: async (id, updates) => {
    const previousThemes = get().themes;
    const theme = previousThemes.find((t) => t.id === id);
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        themes: state.themes.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      // API call
      const result = await themesAPI.update(id, updates);
      
      // Replace with real data
      set((state) => ({
        themes: state.themes.map((t) => (t.id === id ? result : t)),
        isSyncing: false,
      }));
      
      // Recalculate pillar rating if rating changed
      if (theme && updates.rating !== undefined) {
        get().recalculatePillarRating(theme.pillarId);
      }
      
      return result;
    } catch (error) {
      // Rollback
      set({
        themes: previousThemes,
        error: error instanceof APIError ? error.message : 'Failed to update theme',
        isSyncing: false,
      });
      throw error;
    }
  },

  deleteTheme: async (id) => {
    const previousThemes = get().themes;
    const theme = previousThemes.find((t) => t.id === id);
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        themes: state.themes.filter((t) => t.id !== id),
      }));

      // API call
      await themesAPI.delete(id);
      
      set({ isSyncing: false });
      
      // Recalculate pillar rating
      if (theme) {
        get().recalculatePillarRating(theme.pillarId);
      }
    } catch (error) {
      // Rollback
      set({
        themes: previousThemes,
        error: error instanceof APIError ? error.message : 'Failed to delete theme',
        isSyncing: false,
      });
      throw error;
    }
  },

  toggleThemeSelection: (id) =>
    set((state) => ({
      selectedThemeIds: state.selectedThemeIds.includes(id)
        ? state.selectedThemeIds.filter((themeId) => themeId !== id)
        : [...state.selectedThemeIds, id],
    })),

  selectSingleTheme: (id) => set({ selectedThemeIds: [id] }),

  // Task actions with API integration
  addTask: async (task) => {
    const optimisticTask = { 
      ...task, 
      id: generateId(), 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } as Task;
    
    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

      // API call
      const result = await tasksAPI.create(task);
      
      // Replace optimistic with real data
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === optimisticTask.id ? result : t)),
        isSyncing: false,
      }));
      
      return result;
    } catch (error) {
      // Rollback
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== optimisticTask.id),
        error: error instanceof APIError ? error.message : 'Failed to add task',
        isSyncing: false,
      }));
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const previousTasks = get().tasks;

    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      // API call
      const result = await tasksAPI.update(id, updates);

      // Replace with real data
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? result : t)),
        isSyncing: false,
      }));

      return result;
    } catch (error) {
      // Rollback
      set({
        tasks: previousTasks,
        error: error instanceof APIError ? error.message : 'Failed to update task',
        isSyncing: false,
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    const previousTasks = get().tasks;

    try {
      set({ isSyncing: true, error: null });
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));

      // API call
      await tasksAPI.delete(id);

      set({ isSyncing: false });
    } catch (error) {
      // Rollback
      set({
        tasks: previousTasks,
        error: error instanceof APIError ? error.message : 'Failed to delete task',
        isSyncing: false,
      });
      throw error;
    }
  },

  selectTask: (id) => set({ selectedTaskId: id }),

  reorderTasks: async (themeId, taskIds) => {
    const previousTasks = get().tasks;

    try {
      set({ isSyncing: true, error: null });

      // Optimistic update - reorder tasks locally
      const reorderedTasks = taskIds.map((taskId, index) => {
        const task = previousTasks.find((t) => t.id === taskId);
        return task ? { ...task, rank: index } : null;
      }).filter(Boolean) as Task[];

      const otherTasks = previousTasks.filter((t) => !taskIds.includes(t.id));

      set({ tasks: [...otherTasks, ...reorderedTasks] });

      // API call
      const result = await tasksAPI.reorder(themeId, taskIds);

      // Replace with real data
      set((state) => {
        const updatedTaskIds = new Set(result.map((t) => t.id));
        const unchangedTasks = state.tasks.filter((t) => !updatedTaskIds.has(t.id));
        return {
          tasks: [...unchangedTasks, ...result],
          isSyncing: false,
        };
      });

      return result;
    } catch (error) {
      // Rollback
      set({
        tasks: previousTasks,
        error: error instanceof APIError ? error.message : 'Failed to reorder tasks',
        isSyncing: false,
      });
      throw error;
    }
  },

  // Data fetching
  fetchPillars: async () => {
    try {
      set({ isLoading: true, error: null });
      const pillars = await pillarsAPI.getAll();
      set({ pillars, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof APIError ? error.message : 'Failed to fetch pillars',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchThemes: async (pillarId) => {
    try {
      set({ isLoading: true, error: null });
      const themes = await themesAPI.getAll(pillarId);
      set({ themes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof APIError ? error.message : 'Failed to fetch themes',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTasks: async (themeId, pillarId, status) => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await tasksAPI.getAll(themeId, pillarId, status);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof APIError ? error.message : 'Failed to fetch tasks',
        isLoading: false,
      });
      throw error;
    }
  },

  // Computed
  getThemesByPillar: (pillarId) => {
    return get().themes.filter((theme) => theme.pillarId === pillarId);
  },

  getTasksByTheme: (themeId) => {
    return get().tasks.filter((task) => task.themeId === themeId);
  },

  recalculatePillarRating: (pillarId) => {
    const themes = get().themes.filter((t) => t.pillarId === pillarId);
    if (themes.length === 0) return;

    const avgRating = themes.reduce((sum, t) => sum + t.rating, 0) / themes.length;

    set((state) => ({
      pillars: state.pillars.map((p) =>
        p.id === pillarId ? { ...p, rating: Math.round(avgRating) } : p
      ),
    }));
  },
}));

