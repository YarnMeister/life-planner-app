export type PillarDomain = 'work' | 'personal';
export type TaskStatus = 'todo' | 'doing' | 'done' | 'blocked' | 'archived';
export type TaskType = 'adhoc' | 'recurring';
export type Impact = 'H' | 'M' | 'L';
export type TimeEstimate = '15m' | '30m' | '1h' | '2h+';

export interface Pillar {
  id: string;
  name: string;
  color: string;
  domain: PillarDomain;
  rating: number; // 0-100 (was avgPercent)
  weight?: number;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: string;
  pillarId: string;
  name: string;
  rating: number; // 0-100 (was ratingPercent)
  lastReflectionNote?: string;
  previousRating?: number;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  themeId: string;
  pillarId?: string; // DENORMALIZED for fast filtering
  title: string;
  description?: string;
  notes?: string;
  status: TaskStatus; // "todo" | "doing" | "done" | "blocked" | "archived"
  taskType: TaskType; // "adhoc" | "recurring"
  priority?: number;
  impact?: Impact; // "H" | "M" | "L"
  timeEstimate?: TimeEstimate; // "15m" | "30m" | "1h" | "2h+"
  dueDate?: string;
  completedAt?: string;
  rank?: number;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
  recurrenceAnchorDate?: string;
  createdAt: string;
  updatedAt: string;
}
