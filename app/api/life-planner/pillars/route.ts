/**
 * Pillars API Routes
 * GET /api/life-planner/pillars - Get all pillars
 * POST /api/life-planner/pillars - Create a new pillar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { pillarsServiceV2 } from '@/lib/services/pillars.service.v2';
import { getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

// Validation schemas
const createPillarSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  domain: z.enum(['work', 'personal']),
});

/**
 * GET /api/life-planner/pillars
 * Get all pillars for the authenticated user
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

    const pillars = await pillarsServiceV2.getPillars(session.user.id);
    return NextResponse.json({ data: pillars });
  } catch (error) {
    console.error('Error fetching pillars:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * POST /api/life-planner/pillars
 * Create a new pillar
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
    const validatedData = createPillarSchema.parse(body);

    const pillar = await pillarsServiceV2.createPillar(validatedData, session.user.id);
    return NextResponse.json({ data: pillar }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating pillar:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

