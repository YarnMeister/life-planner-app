/**
 * Individual Pillar API Routes
 * GET /api/life-planner/pillars/[id] - Get a pillar
 * PATCH /api/life-planner/pillars/[id] - Update a pillar
 * DELETE /api/life-planner/pillars/[id] - Delete a pillar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth/session';
import { pillarsService, getErrorStatus, getErrorMessage } from '@/src/lib/services';
import { z } from 'zod';

const updatePillarSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  domain: z.enum(['work', 'personal']).optional(),
  avgPercent: z.number().min(0).max(100).optional(),
});

/**
 * GET /api/life-planner/pillars/[id]
 * Get a single pillar with details
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

    const pillar = await pillarsService.getPillarWithDetails(params.id, session.user.id);
    return NextResponse.json({ data: pillar });
  } catch (error) {
    console.error('Error fetching pillar:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * PATCH /api/life-planner/pillars/[id]
 * Update a pillar
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
    const validatedData = updatePillarSchema.parse(body);

    const pillar = await pillarsService.updatePillar(params.id, validatedData, session.user.id);
    return NextResponse.json({ data: pillar });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating pillar:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * DELETE /api/life-planner/pillars/[id]
 * Delete a pillar
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

    await pillarsService.deletePillar(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pillar:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

