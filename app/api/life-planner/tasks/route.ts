/**
 * Tasks API Routes
 * GET /api/life-planner/tasks - Get all tasks
 * POST /api/life-planner/tasks - Create a new task
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tasksServiceV2 } from '@/lib/services/tasks.service.v2';
import { getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

// Validation schemas
const createTaskSchema = z.object({
  themeId: z.string().uuid('Invalid theme ID'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done', 'blocked', 'archived']).optional(),
  taskType: z.enum(['adhoc', 'recurring']).optional(),
  priority: z.number().min(1).max(5).optional(),
  impact: z.enum(['H', 'M', 'L']).optional(),
  timeEstimate: z.enum(['15m', '30m', '1h', '2h+']).optional(),
  effort: z.number().optional(),
  tags: z.array(z.string()).optional(),
  ratingImpact: z.number().optional(),
  rank: z.number().optional(),
  dueDate: z.string().optional(),
  dueAt: z.string().optional(),
  recurrence: z.object({
    rule: z.string(),
    until: z.string().optional(),
  }).optional(),
  recurrenceFrequency: z.string().optional(),
  recurrenceInterval: z.number().min(1).optional(),
});

/**
 * GET /api/life-planner/tasks
 * Get all tasks for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Optional: filter by themeId, pillarId, or status query params
    const themeId = request.nextUrl.searchParams.get('themeId');
    const pillarId = request.nextUrl.searchParams.get('pillarId');
    const status = request.nextUrl.searchParams.get('status') as 'todo' | 'doing' | 'done' | 'blocked' | 'archived' | null;

    let tasks;
    if (themeId) {
      tasks = await tasksServiceV2.getTasksByTheme(themeId, session.user.id);
    } else if (pillarId) {
      tasks = await tasksServiceV2.getTasksByPillar(pillarId, session.user.id);
    } else if (status) {
      tasks = await tasksServiceV2.getTasksByStatus(status, session.user.id);
    } else {
      tasks = await tasksServiceV2.getTasks(session.user.id);
    }

    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * POST /api/life-planner/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const task = await tasksServiceV2.createTask(validatedData, session.user.id);
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

