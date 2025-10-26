# Phase 2: Implementation Patterns & Code Examples

## 1. SERVICE LAYER PATTERN

### 1.1 Base Service Class
```typescript
// src/lib/services/base.service.ts
import { db } from '@/lib/auth/db.server';

export abstract class BaseService {
  protected db = db;
  
  protected async ensureUserAccess(userId: string, resourceId: string, table: any) {
    // Verify user owns the resource
    const resource = await this.db.query[table].findFirst({
      where: { id: resourceId, userId }
    });
    
    if (!resource) {
      throw new NotFoundError('Resource not found');
    }
    
    return resource;
  }
}
```

### 1.2 Pillars Service Example
```typescript
// src/lib/services/pillars.service.ts
import { pillars, themes } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export class PillarsService extends BaseService {
  async getPillars(userId: string) {
    return this.db
      .select()
      .from(pillars)
      .where(eq(pillars.userId, userId));
  }
  
  async createPillar(data: CreatePillarInput, userId: string) {
    const [pillar] = await this.db
      .insert(pillars)
      .values({
        ...data,
        userId,
        avgPercent: 0,
      })
      .returning();
    
    return pillar;
  }
  
  async updatePillar(id: string, data: UpdatePillarInput, userId: string) {
    await this.ensureUserAccess(userId, id, pillars);
    
    const [updated] = await this.db
      .update(pillars)
      .set(data)
      .where(and(eq(pillars.id, id), eq(pillars.userId, userId)))
      .returning();
    
    return updated;
  }
  
  async recalculateAverage(pillarId: string, userId: string) {
    const pillarThemes = await this.db
      .select()
      .from(themes)
      .where(and(
        eq(themes.pillarId, pillarId),
        eq(themes.userId, userId)
      ));
    
    const avg = pillarThemes.length > 0
      ? Math.round(
          pillarThemes.reduce((sum, t) => sum + t.ratingPercent, 0) / 
          pillarThemes.length
        )
      : 0;
    
    await this.db
      .update(pillars)
      .set({ avgPercent: avg })
      .where(and(eq(pillars.id, pillarId), eq(pillars.userId, userId)));
  }
}
```

---

## 2. API ROUTE PATTERN

### 2.1 GET Route Example
```typescript
// app/api/life-planner/pillars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PillarsService } from '@/lib/services/pillars.service';
import { getCurrentUser } from '@/lib/auth/utils';

const service = new PillarsService();

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const pillars = await service.getPillars(user.id);
    return NextResponse.json(pillars);
  } catch (error) {
    console.error('GET /pillars error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const pillar = await service.createPillar(data, user.id);
    
    return NextResponse.json(pillar, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    console.error('POST /pillars error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2.2 Dynamic Route Example
```typescript
// app/api/life-planner/pillars/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PillarsService } from '@/lib/services/pillars.service';
import { getCurrentUser } from '@/lib/auth/utils';

const service = new PillarsService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const pillar = await service.getPillar(params.id, user.id);
    return NextResponse.json(pillar);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const pillar = await service.updatePillar(params.id, data, user.id);
    
    return NextResponse.json(pillar);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await service.deletePillar(params.id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 3. ZUSTAND STORE PATTERN

### 3.1 Optimistic Update Pattern
```typescript
// src/store/useLifeOSStore.ts - Updated pattern
import { create } from 'zustand';

interface LifeOSState {
  // ... existing state
  isLoading: boolean;
  error: string | null;
  
  // Optimistic update for tasks
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const useLifeOSStore = create<LifeOSState>((set, get) => ({
  // ... existing state
  isLoading: false,
  error: null,
  
  updateTask: async (id, updates) => {
    // 1. Find current task
    const currentTask = get().tasks.find(t => t.id === id);
    if (!currentTask) throw new Error('Task not found');
    
    // 2. Update immediately (optimistic)
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
      isLoading: true,
      error: null,
    }));
    
    try {
      // 3. Call API
      const response = await fetch(`/api/life-planner/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      // 4. Success - state already updated
      set({ isLoading: false });
    } catch (error) {
      // 5. Rollback on error
      set(state => ({
        tasks: state.tasks.map(t =>
          t.id === id ? currentTask : t
        ),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      
      // Show error toast
      toast.error('Failed to update task');
    }
  },
}));
```

---

## 4. VALIDATION PATTERN

### 4.1 Zod Schemas
```typescript
// src/lib/schemas/life-planner.ts
import { z } from 'zod';

export const CreatePillarSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  domain: z.enum(['work', 'personal']),
});

export const UpdatePillarSchema = CreatePillarSchema.partial();

export const CreateThemeSchema = z.object({
  pillarId: z.string().uuid(),
  name: z.string().min(1).max(100),
  ratingPercent: z.number().min(0).max(100).default(50),
});

export const CreateTaskSchema = z.object({
  pillarId: z.string().uuid(),
  themeId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  timeEstimate: z.enum(['15m', '30m', '1h', '2h+']).optional(),
  impact: z.enum(['H', 'M', 'L']).optional(),
  status: z.enum(['open', 'done']).default('open'),
  dueDate: z.string().date().optional(),
  rank: z.number().default(0),
});
```

### 4.2 Validation Middleware
```typescript
// src/lib/middleware/validate.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const data = await request.json();
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }
  };
}
```

---

## 5. ERROR HANDLING PATTERN

### 5.1 Custom Error Classes
```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message, 'CONFLICT');
  }
}
```

### 5.2 Error Handler Middleware
```typescript
// src/lib/middleware/error-handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';

export function handleError(error: unknown) {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 6. TESTING PATTERN

### 6.1 Service Test Example
```typescript
// src/lib/services/__tests__/pillars.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PillarsService } from '../pillars.service';

describe('PillarsService', () => {
  let service: PillarsService;
  
  beforeEach(() => {
    service = new PillarsService();
  });
  
  it('should create a pillar', async () => {
    const result = await service.createPillar(
      {
        name: 'Health',
        color: '#7C3AED',
        domain: 'personal',
      },
      'user-123'
    );
    
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Health');
    expect(result.userId).toBe('user-123');
  });
  
  it('should throw NotFoundError when updating non-existent pillar', async () => {
    await expect(
      service.updatePillar('non-existent', { name: 'Updated' }, 'user-123')
    ).rejects.toThrow(NotFoundError);
  });
});
```

### 6.2 Store Test Example
```typescript
// src/store/__tests__/useLifeOSStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLifeOSStore } from '../useLifeOSStore';

describe('useLifeOSStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useLifeOSStore.setState({
      pillars: [],
      themes: [],
      tasks: [],
    });
  });
  
  it('should update task optimistically', async () => {
    const store = useLifeOSStore.getState();
    
    // Mock API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    
    // Add initial task
    store.addTask({
      title: 'Test',
      pillarId: '1',
      themeId: 'h1',
      status: 'open',
      rank: 0,
    });
    
    const taskId = store.tasks[0].id;
    
    // Update task
    await store.updateTask(taskId, { status: 'done' });
    
    // Verify optimistic update
    expect(store.tasks[0].status).toBe('done');
  });
});
```

---

## 7. MIGRATION SCRIPT PATTERN

### 7.1 Seed Script Example
```typescript
// scripts/seed-life-planner.ts
import { db } from '@/src/lib/auth/db.server';
import { pillars, themes, tasks } from '@/drizzle/schema';
import { initialPillars, initialThemes, initialTasks } from '@/src/store/useLifeOSStore';

async function seedDatabase() {
  const userId = 'seed-user-id'; // Use fixed ID for seeding
  
  console.log('🌱 Seeding life-planner data...');
  
  // Insert pillars
  const insertedPillars = await db
    .insert(pillars)
    .values(
      initialPillars.map(p => ({
        ...p,
        userId,
      }))
    )
    .returning();
  
  console.log(`✅ Inserted ${insertedPillars.length} pillars`);
  
  // Insert themes
  const insertedThemes = await db
    .insert(themes)
    .values(
      initialThemes.map(t => ({
        ...t,
        userId,
      }))
    )
    .returning();
  
  console.log(`✅ Inserted ${insertedThemes.length} themes`);
  
  // Insert tasks
  const insertedTasks = await db
    .insert(tasks)
    .values(
      initialTasks.map(t => ({
        ...t,
        userId,
      }))
    )
    .returning();
  
  console.log(`✅ Inserted ${insertedTasks.length} tasks`);
  
  // Verify
  const pillarCount = await db.select().from(pillars);
  const themeCount = await db.select().from(themes);
  const taskCount = await db.select().from(tasks);
  
  console.log(`\n📊 Final counts:`);
  console.log(`   Pillars: ${pillarCount.length}`);
  console.log(`   Themes: ${themeCount.length}`);
  console.log(`   Tasks: ${taskCount.length}`);
}

seedDatabase().catch(console.error);
```

---

## 8. KEY IMPLEMENTATION NOTES

### 8.1 User Isolation
- Always include `userId` in WHERE clauses
- Never trust client-provided user IDs
- Use `getCurrentUser()` from auth utils

### 8.2 Optimistic Updates
- Save previous state before updating
- Update UI immediately
- Rollback on API error
- Show error toast

### 8.3 Error Handling
- Use typed error classes
- Return appropriate HTTP status codes
- Log errors for debugging
- Show user-friendly messages

### 8.4 Performance
- Use indexes for common queries
- Avoid N+1 queries
- Batch operations when possible
- Cache computed values (pillar averages)

### 8.5 Testing
- Mock API responses
- Test error scenarios
- Verify user isolation
- Test optimistic update rollback

