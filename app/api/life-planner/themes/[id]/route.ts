/**
 * Individual Theme API Routes
 * GET /api/life-planner/themes/[id] - Get a theme
 * PATCH /api/life-planner/themes/[id] - Update a theme
 * DELETE /api/life-planner/themes/[id] - Delete a theme
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth/session';
import { themesService, getErrorStatus, getErrorMessage } from '@/src/lib/services';
import { z } from 'zod';

const updateThemeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  ratingPercent: z.number().min(0).max(100).optional(),
  lastReflectionNote: z.string().optional(),
});

/**
 * GET /api/life-planner/themes/[id]
 * Get a single theme with all tasks
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

    const theme = await themesService.getThemeWithTasks(params.id, session.user.id);
    return NextResponse.json({ data: theme });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * PATCH /api/life-planner/themes/[id]
 * Update a theme
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
    const validatedData = updateThemeSchema.parse(body);

    const theme = await themesService.updateTheme(params.id, validatedData, session.user.id);
    return NextResponse.json({ data: theme });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * DELETE /api/life-planner/themes/[id]
 * Delete a theme and all associated tasks
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

    await themesService.deleteTheme(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

