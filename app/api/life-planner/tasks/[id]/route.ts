/**
 * Individual Task API Routes
 * GET /api/life-planner/tasks/[id] - Get a task
 * PATCH /api/life-planner/tasks/[id] - Update a task
 * DELETE /api/life-planner/tasks/[id] - Delete a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tasksServiceV2 } from '@/lib/services/tasks.service.v2';
import { getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
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
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  recurrence: z.object({
    rule: z.string(),
    until: z.string().optional(),
  }).optional(),
  recurrenceFrequency: z.string().optional(),
  recurrenceInterval: z.number().min(1).optional(),
});

/**
 * GET /api/life-planner/tasks/[id]
 * Get a single task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const task = await tasksServiceV2.getTask(id, session.user.id);
    return NextResponse.json({ data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * PATCH /api/life-planner/tasks/[id]
 * Update a task
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const { id } = await params;
    const task = await tasksServiceV2.updateTask(id, validatedData, session.user.id);
    return NextResponse.json({ data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * DELETE /api/life-planner/tasks/[id]
 * Delete a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await tasksServiceV2.deleteTask(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

