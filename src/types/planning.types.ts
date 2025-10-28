// ============================================================================
// PILLAR TYPES (Extended from proposal)
// ============================================================================

export type PillarDomain = 'work' | 'personal';

export interface Pillar {
  id: string;                    // UUID
  name: string;                  // "Health"
  color: string;                 // "#7C3AED"
  domain: PillarDomain;          // work/personal
  rating: number;                // 0-100 (was avgPercent)
  weight?: number;               // Optional weighting
  order?: number;                // UI ordering
  createdAt: string;             // ISO datetime
  updatedAt: string;             // ISO datetime
}

export type PillarsDoc = Pillar[];

// ============================================================================
// THEME TYPES (Extended from proposal)
// ============================================================================

export interface Theme {
  id: string;                    // UUID
  pillarId: string;              // FK to Pillar.id
  name: string;                  // "Cardio"
  rating: number;                // 0-100 (was ratingPercent)
  lastReflectionNote?: string;   // EXTENDED: reflection notes
  previousRating?: number;       // EXTENDED: history tracking
  order?: number;                // UI ordering
  createdAt: string;             // ISO datetime
  updatedAt: string;             // ISO datetime
}

export type ThemesDoc = Theme[];

// ============================================================================
// TASK TYPES (Extended from proposal)
// ============================================================================

export type TaskStatus = "todo" | "doing" | "done" | "blocked" | "archived";
export type TaskType = "adhoc" | "recurring";
export type TimeEstimate = "15m" | "30m" | "1h" | "2h+";
export type Impact = "H" | "M" | "L";

export interface Recurrence {
  rule: string;                  // RRULE format: "FREQ=WEEKLY;BYDAY=MO"
  until?: string;                // ISO datetime
}

export interface Task {
  id: string;                    // UUID
  themeId: string;               // FK to Theme.id
  pillarId?: string;             // DENORMALIZED: for fast filtering
  title: string;                 // Task title
  description?: string;          // Detailed description
  notes?: string;                // EXTENDED: additional notes
  status: TaskStatus;            // todo/doing/done/blocked/archived
  taskType: TaskType;            // EXTENDED: adhoc/recurring
  priority?: number;             // 1-5
  impact?: Impact;               // EXTENDED: H/M/L
  timeEstimate?: TimeEstimate;   // EXTENDED: 15m/30m/1h/2h+
  effort?: number;               // Points or minutes
  tags?: string[];               // Labels
  ratingImpact?: number;         // Impact on theme rating
  rank?: number;                 // EXTENDED: ordering within theme (was rank)
  order?: number;                // Alternative ordering field
  dueDate?: string;              // ISO date (YYYY-MM-DD)
  dueAt?: string;                // ISO datetime (for time-specific)
  startedAt?: string;            // ISO datetime
  completedAt?: string;          // ISO datetime
  recurrence?: Recurrence;       // Recurrence rules
  recurrenceFrequency?: string;  // EXTENDED: legacy field
  recurrenceInterval?: number;   // EXTENDED: legacy field
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  meta?: Record<string, unknown>; // Free-form extras
  createdAt: string;             // ISO datetime
  updatedAt: string;             // ISO datetime
}

export type TasksDoc = Task[];

// ============================================================================
// PLANNING DOCUMENT WRAPPER
// ============================================================================

export type PlanningDocKind = 'pillars' | 'themes' | 'tasks';

export interface PlanningDocument<T = PillarsDoc | ThemesDoc | TasksDoc> {
  id: string;
  userId: string;
  kind: PlanningDocKind;
  data: T;
  version: number;
  createdAt: string;
  updatedAt: string;
}

