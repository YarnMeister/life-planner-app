import { z } from 'zod';

// ============================================================================
// PILLAR SCHEMA
// ============================================================================

export const zPillar = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  domain: z.enum(['work', 'personal']),
  rating: z.number().int().min(0).max(100),
  weight: z.number().int().optional(),
  order: z.number().int().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const zPillarsDoc = z.array(zPillar);

// ============================================================================
// THEME SCHEMA
// ============================================================================

export const zTheme = z.object({
  id: z.string().uuid(),
  pillarId: z.string().uuid(),
  name: z.string().min(1).max(100),
  rating: z.number().int().min(0).max(100),
  lastReflectionNote: z.string().optional(),
  previousRating: z.number().int().min(0).max(100).optional(),
  order: z.number().int().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const zThemesDoc = z.array(zTheme);

// ============================================================================
// TASK SCHEMA
// ============================================================================

export const zRecurrence = z.object({
  rule: z.string(),
  until: z.string().datetime().optional(),
});

export const zTask = z.object({
  id: z.string().uuid(),
  themeId: z.string().uuid(),
  pillarId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done', 'blocked', 'archived']),
  taskType: z.enum(['adhoc', 'recurring']),
  priority: z.number().int().min(1).max(5).optional(),
  impact: z.enum(['H', 'M', 'L']).optional(),
  timeEstimate: z.enum(['15m', '30m', '1h', '2h+']).optional(),
  effort: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  ratingImpact: z.number().int().optional(),
  rank: z.number().int().optional(),
  order: z.number().int().optional(),
  // Date fields: dueDate is YYYY-MM-DD string, others are ISO 8601 datetime strings
  // All datetime fields must use .toISOString() when setting timestamps
  // UI must enforce YYYY-MM-DD format for dueDate (e.g., DateInput with valueFormat="YYYY-MM-DD")
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
  dueAt: z.string().datetime().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  recurrence: zRecurrence.optional(),
  recurrenceFrequency: z.string().optional(),
  recurrenceInterval: z.number().int().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
  })).optional(),
  meta: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const zTasksDoc = z.array(zTask);

// ============================================================================
// JSON PATCH SCHEMA (RFC-6902)
// ============================================================================

export const zJsonPatchOp = z.object({
  op: z.enum(['add', 'remove', 'replace', 'move', 'copy', 'test']),
  path: z.string(), // JSON Pointer: "/0/name" or "/3/status"
  value: z.unknown().optional(),
  from: z.string().optional(), // For move/copy
});

export const zJsonPatch = z.array(zJsonPatchOp);

