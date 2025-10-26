# Phase 2: Quick Reference Guide

## 📁 File Structure (After Phase 2)

```
life-planner-nextjs/
├── drizzle/
│   ├── schema.ts                    # Extended with pillars, themes, tasks
│   └── migrations/
│       └── [timestamp]_*.sql        # New migration files
│
├── src/
│   ├── lib/
│   │   ├── services/                # NEW
│   │   │   ├── base.service.ts
│   │   │   ├── pillars.service.ts
│   │   │   ├── themes.service.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── __tests__/
│   │   │       ├── pillars.service.test.ts
│   │   │       ├── themes.service.test.ts
│   │   │       └── tasks.service.test.ts
│   │   ├── schemas/                 # NEW
│   │   │   └── life-planner.ts
│   │   ├── errors.ts                # NEW
│   │   └── auth/
│   │       └── db.server.ts         # Updated
│   │
│   ├── store/
│   │   ├── useLifeOSStore.ts        # Updated with API calls
│   │   └── __tests__/
│   │       └── useLifeOSStore.test.ts
│   │
│   └── tests/
│       └── e2e/                     # NEW
│           └── life-planner.e2e.test.ts
│
├── app/
│   └── api/
│       └── life-planner/            # NEW
│           ├── pillars/
│           │   ├── route.ts
│           │   └── [id]/
│           │       └── route.ts
│           ├── themes/
│           │   ├── route.ts
│           │   └── [id]/
│           │       └── route.ts
│           └── tasks/
│               ├── route.ts
│               ├── [id]/
│               │   └── route.ts
│               └── reorder/
│                   └── route.ts
│
└── scripts/
    └── seed-life-planner.ts         # NEW
```

---

## 🔗 API Endpoints

### Pillars
```
GET    /api/life-planner/pillars           # List all
POST   /api/life-planner/pillars           # Create
GET    /api/life-planner/pillars/[id]      # Get one
PATCH  /api/life-planner/pillars/[id]      # Update
DELETE /api/life-planner/pillars/[id]      # Delete
```

### Themes
```
GET    /api/life-planner/themes            # List all
POST   /api/life-planner/themes            # Create
GET    /api/life-planner/themes/[id]       # Get one
PATCH  /api/life-planner/themes/[id]       # Update
DELETE /api/life-planner/themes/[id]       # Delete
```

### Tasks
```
GET    /api/life-planner/tasks             # List all
POST   /api/life-planner/tasks             # Create
GET    /api/life-planner/tasks/[id]        # Get one
PATCH  /api/life-planner/tasks/[id]        # Update
DELETE /api/life-planner/tasks/[id]        # Delete
POST   /api/life-planner/tasks/reorder     # Reorder
```

---

## 🗄️ Database Schema

### Pillars Table
```sql
CREATE TABLE pillars (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  domain ENUM('work', 'personal') NOT NULL,
  avg_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Themes Table
```sql
CREATE TABLE themes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  pillar_id UUID NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating_percent INTEGER DEFAULT 50,
  last_reflection_note TEXT,
  previous_rating INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  pillar_id UUID NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_estimate ENUM('15m', '30m', '1h', '2h+'),
  impact ENUM('H', 'M', 'L'),
  status ENUM('open', 'done') DEFAULT 'open',
  due_date DATE,
  rank INTEGER DEFAULT 0,
  notes TEXT,
  task_type ENUM('adhoc', 'recurring') DEFAULT 'adhoc',
  recurrence_frequency ENUM('daily', 'weekly', 'monthly'),
  recurrence_interval INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 🛠️ Common Commands

### Database
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Check migration status
npm run db:status

# Seed initial data
npx ts-node scripts/seed-life-planner.ts

# Test database connection
npm run db:test-connection
```

### Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

### Development
```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🔑 Key Classes & Functions

### Services
```typescript
// src/lib/services/pillars.service.ts
class PillarsService {
  getPillars(userId: string): Promise<Pillar[]>
  getPillar(id: string, userId: string): Promise<Pillar>
  createPillar(data: CreatePillarInput, userId: string): Promise<Pillar>
  updatePillar(id: string, data: UpdatePillarInput, userId: string): Promise<Pillar>
  deletePillar(id: string, userId: string): Promise<void>
  recalculateAverage(pillarId: string, userId: string): Promise<void>
}

// Similar for ThemesService and TasksService
```

### Store Actions
```typescript
// src/store/useLifeOSStore.ts
const store = useLifeOSStore();

// Async actions (return Promise)
await store.addPillar(pillarData)
await store.updatePillar(id, updates)
await store.deletePillar(id)
await store.addTheme(themeData)
await store.updateTheme(id, updates)
await store.deleteTheme(id)
await store.addTask(taskData)
await store.updateTask(id, updates)
await store.deleteTask(id)
await store.reorderTasks(themeId, tasks)

// State
store.pillars
store.themes
store.tasks
store.isLoading
store.error
```

---

## 🧪 Testing Patterns

### Service Test
```typescript
import { PillarsService } from '@/lib/services/pillars.service';

const service = new PillarsService();
const pillar = await service.createPillar(data, userId);
expect(pillar.name).toBe('Health');
```

### Store Test
```typescript
import { useLifeOSStore } from '@/store/useLifeOSStore';

const store = useLifeOSStore.getState();
await store.addPillar(data);
expect(store.pillars).toHaveLength(1);
```

### API Test
```typescript
const response = await fetch('/api/life-planner/pillars', {
  method: 'POST',
  body: JSON.stringify(data),
});
expect(response.status).toBe(201);
```

---

## ⚠️ Important Notes

### User Isolation
- Always include `user_id` in WHERE clauses
- Never trust client-provided user IDs
- Use `getCurrentUser()` from auth utils

### Optimistic Updates
- Update UI immediately
- Call API in background
- Rollback on error
- Show error toast

### Error Handling
- Use typed error classes
- Return appropriate HTTP status codes
- Log errors for debugging
- Show user-friendly messages

### Performance
- Use indexes for common queries
- Avoid N+1 queries
- Batch operations when possible
- Cache computed values

---

## 🔍 Debugging Tips

### Check Database
```bash
# Connect to Neon
psql $DATABASE_URL

# List tables
\dt

# Check data
SELECT COUNT(*) FROM pillars;
SELECT COUNT(*) FROM themes;
SELECT COUNT(*) FROM tasks;
```

### Check API
```bash
# Test endpoint
curl http://localhost:3000/api/life-planner/pillars

# With auth header
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/life-planner/pillars
```

### Check Store
```typescript
// In browser console
import { useLifeOSStore } from '@/store/useLifeOSStore';
const store = useLifeOSStore.getState();
console.log(store.pillars);
console.log(store.isLoading);
console.log(store.error);
```

---

## 📊 Data Counts

After seeding, you should have:
- **5 pillars**: Health, Finance, Social, Family, Work
- **25 themes**: 5 per pillar on average
- **73 tasks**: Distributed across themes

Verify with:
```sql
SELECT COUNT(*) FROM pillars;  -- 5
SELECT COUNT(*) FROM themes;   -- 25
SELECT COUNT(*) FROM tasks;    -- 73
```

---

## 🚀 Deployment Checklist

- [ ] Schema migrations generated
- [ ] Migrations tested on staging
- [ ] Seed script tested
- [ ] All services implemented
- [ ] All API routes implemented
- [ ] Unit tests passing (100% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance acceptable (< 200ms p95)
- [ ] Error handling tested
- [ ] Deployed to production
- [ ] Monitoring set up
- [ ] Data verified in production

---

## 📞 Support Resources

- **Drizzle Docs**: https://orm.drizzle.team
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Zod Docs**: https://zod.dev

---

**Last Updated**: 2025-10-26
**Version**: 1.0

