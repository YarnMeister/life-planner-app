/**
 * Individual Task API Routes
 * GET /api/life-planner/tasks/[id] - Get a task
 * PATCH /api/life-planner/tasks/[id] - Update a task
 * DELETE /api/life-planner/tasks/[id] - Delete a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth/session';
import { tasksService, getErrorStatus, getErrorMessage } from '@/src/lib/services';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
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
 * GET /api/life-planner/tasks/[id]
 * Get a single task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const task = await tasksService.getTask(params.id, session.user.id);
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
  { params }: { params: { id: string } }
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

    const task = await tasksService.updateTask(params.id, validatedData, session.user.id);
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await tasksService.deleteTask(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

