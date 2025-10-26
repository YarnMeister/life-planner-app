/**
 * Themes API Routes
 * GET /api/life-planner/themes - Get all themes
 * POST /api/life-planner/themes - Create a new theme
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { themesService, getErrorStatus, getErrorMessage } from '@/lib/services';
import { z } from 'zod';

// Validation schemas
const createThemeSchema = z.object({
  pillarId: z.string().uuid('Invalid pillar ID'),
  name: z.string().min(1, 'Name is required').max(100),
  ratingPercent: z.number().min(0).max(100).optional(),
});

/**
 * GET /api/life-planner/themes
 * Get all themes for the authenticated user
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

    // Optional: filter by pillarId query param
    const pillarId = request.nextUrl.searchParams.get('pillarId');
    
    let themes;
    if (pillarId) {
      themes = await themesService.getThemesByPillar(pillarId, session.user.id);
    } else {
      themes = await themesService.getThemes(session.user.id);
    }

    return NextResponse.json({ data: themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

/**
 * POST /api/life-planner/themes
 * Create a new theme
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
    const validatedData = createThemeSchema.parse(body);

    const theme = await themesService.createTheme(validatedData, session.user.id);
    return NextResponse.json({ data: theme }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: getErrorMessage(error as Error) },
      { status: getErrorStatus(error as Error) }
    );
  }
}

