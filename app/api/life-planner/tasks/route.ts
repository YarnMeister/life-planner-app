/**
 * Tasks API Routes
 * GET /api/life-planner/tasks - Get all tasks
 * POST /api/life-planner/tasks - Create a new task
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tasksService, getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

// Validation schemas
const createTaskSchema = z.object({
  pillarId: z.string().uuid('Invalid pillar ID'),
  themeId: z.string().uuid('Invalid theme ID'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  timeEstimate: z.enum(['15m', '30m', '1h', '2h+']).optional(),
  impact: z.enum(['H', 'M', 'L']).optional(),
  status: z.enum(['open', 'done']).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  taskType: z.enum(['adhoc', 'recurring']).optional(),
  recurrenceFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
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

    // Optional: filter by themeId or status query params
    const themeId = request.nextUrl.searchParams.get('themeId');
    const status = request.nextUrl.searchParams.get('status') as 'open' | 'done' | null;

    let tasks;
    if (themeId) {
      tasks = await tasksService.getTasksByTheme(themeId, session.user.id);
    } else if (status) {
      tasks = await tasksService.getTasksByStatus(status, session.user.id);
    } else {
      tasks = await tasksService.getTasks(session.user.id);
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

    const task = await tasksService.createTask(validatedData, session.user.id);
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

