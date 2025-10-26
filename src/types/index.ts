export type PillarDomain = 'work' | 'personal';

export interface Pillar {
  id: string;
  name: string;
  color: string;
  domain: PillarDomain;
  avgPercent: number;
}

export interface Theme {
  id: string;
  pillarId: string;
  name: string;
  ratingPercent: number;
  lastReflectionNote?: string;
  previousRating?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  pillarId: string;
  themeId: string;
  timeEstimate?: '15m' | '30m' | '1h' | '2h+';
  impact?: 'H' | 'M' | 'L';
  status: 'open' | 'done';
  dueDate?: string;
  rank: number;
  notes?: string;
  taskType?: 'adhoc' | 'recurring';
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
}
