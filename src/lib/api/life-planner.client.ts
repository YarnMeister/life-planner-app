/**
 * Life Planner API Client
 * Handles all API calls to the Life Planner endpoints
 */

import { Pillar, Theme, Task } from '@/types';

const API_BASE = '/api/life-planner';

// Error handling
export class APIError extends Error {
  constructor(
    public status: number,
    public details?: any,
    message?: string
  ) {
    super(message || `API Error: ${status}`);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      error.details,
      error.error || `HTTP ${response.status}`
    );
  }
  const data = await response.json();
  return data.data;
}

// Pillars API
export const pillarsAPI = {
  async getAll(): Promise<Pillar[]> {
    const response = await fetch(`${API_BASE}/pillars`);
    return handleResponse(response);
  },

  async getOne(id: string): Promise<Pillar> {
    const response = await fetch(`${API_BASE}/pillars/${id}`);
    return handleResponse(response);
  },

  async create(data: Omit<Pillar, 'id' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<Pillar> {
    const response = await fetch(`${API_BASE}/pillars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: Partial<Pillar>): Promise<Pillar> {
    const response = await fetch(`${API_BASE}/pillars/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/pillars/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

// Themes API
export const themesAPI = {
  async getAll(pillarId?: string): Promise<Theme[]> {
    const url = new URL(`${API_BASE}/themes`, window.location.origin);
    if (pillarId) url.searchParams.set('pillarId', pillarId);
    const response = await fetch(url.toString());
    return handleResponse(response);
  },

  async getOne(id: string): Promise<Theme> {
    const response = await fetch(`${API_BASE}/themes/${id}`);
    return handleResponse(response);
  },

  async create(data: Omit<Theme, 'id' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<Theme> {
    const response = await fetch(`${API_BASE}/themes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: Partial<Theme>): Promise<Theme> {
    const response = await fetch(`${API_BASE}/themes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/themes/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

// Tasks API
export const tasksAPI = {
  async getAll(themeId?: string, pillarId?: string, status?: 'todo' | 'doing' | 'done' | 'blocked' | 'archived'): Promise<Task[]> {
    const url = new URL(`${API_BASE}/tasks`, window.location.origin);
    if (themeId) url.searchParams.set('themeId', themeId);
    if (pillarId) url.searchParams.set('pillarId', pillarId);
    if (status) url.searchParams.set('status', status);
    const response = await fetch(url.toString());
    return handleResponse(response);
  },

  async getOne(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    return handleResponse(response);
  },

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },

  async reorder(themeId: string, taskIds: string[]): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId, taskIds }),
    });
    return handleResponse(response);
  },
};

