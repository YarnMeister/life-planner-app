/**
 * Task Reorder API Route
 * POST /api/life-planner/tasks/reorder - Reorder tasks within a theme
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tasksService, getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

const reorderTasksSchema = z.object({
  themeId: z.string().uuid('Invalid theme ID'),
  taskIds: z.array(z.string().uuid('Invalid task ID')).min(1, 'At least one task ID is required'),
});

/**
 * POST /api/life-planner/tasks/reorder
 * Reorder tasks within a theme by updating their rank
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
    const validatedData = reorderTasksSchema.parse(body);

    const tasks = await tasksService.reorderTasks(
      validatedData.themeId,
      validatedData.taskIds,
      session.user.id
    );

    return NextResponse.json({ data: tasks });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error reordering tasks:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

