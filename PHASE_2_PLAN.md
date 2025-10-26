# Phase 2: Database Integration - Detailed Implementation Plan

## Executive Summary
Replace in-memory Zustand store with Neon PostgreSQL persistence while maintaining identical UX/UI. Implement optimistic updates for seamless user experience.

---

## 1. DATABASE SCHEMA DESIGN

### 1.1 Core Tables

#### `pillars` table
```
- id: UUID (PK)
- user_id: UUID (FK → users.id)
- name: TEXT (NOT NULL)
- color: TEXT (NOT NULL) - hex color code
- domain: ENUM ('work', 'personal') (NOT NULL)
- avg_percent: INTEGER (default 0)
- created_at: TIMESTAMP (default now())
- updated_at: TIMESTAMP (default now())

Indexes:
- (user_id, created_at)
- (user_id, domain)
```

#### `themes` table
```
- id: UUID (PK)
- user_id: UUID (FK → users.id)
- pillar_id: UUID (FK → pillars.id, ON DELETE CASCADE)
- name: TEXT (NOT NULL)
- rating_percent: INTEGER (default 50)
- last_reflection_note: TEXT (nullable)
- previous_rating: INTEGER (nullable)
- created_at: TIMESTAMP (default now())
- updated_at: TIMESTAMP (default now())

Indexes:
- (user_id, pillar_id)
- (pillar_id)
```

#### `tasks` table
```
- id: UUID (PK)
- user_id: UUID (FK → users.id)
- pillar_id: UUID (FK → pillars.id, ON DELETE CASCADE)
- theme_id: UUID (FK → themes.id, ON DELETE CASCADE)
- title: TEXT (NOT NULL)
- description: TEXT (nullable)
- time_estimate: ENUM ('15m', '30m', '1h', '2h+') (nullable)
- impact: ENUM ('H', 'M', 'L') (nullable)
- status: ENUM ('open', 'done') (default 'open')
- due_date: DATE (nullable)
- rank: INTEGER (default 0)
- notes: TEXT (nullable)
- task_type: ENUM ('adhoc', 'recurring') (default 'adhoc')
- recurrence_frequency: ENUM ('daily', 'weekly', 'monthly') (nullable)
- recurrence_interval: INTEGER (nullable)
- created_at: TIMESTAMP (default now())
- updated_at: TIMESTAMP (default now())

Indexes:
- (user_id, theme_id, rank)
- (user_id, status)
- (user_id, due_date)
- (pillar_id)
- (theme_id)
```

### 1.2 Data Relationships
```
users (1) ──→ (many) pillars
users (1) ──→ (many) themes
users (1) ──→ (many) tasks

pillars (1) ──→ (many) themes
pillars (1) ──→ (many) tasks

themes (1) ──→ (many) tasks
```

### 1.3 Constraints & Validations
- All records must have user_id (multi-tenancy)
- Cascade deletes: pillar deletion → delete themes & tasks
- Theme deletion → delete associated tasks
- Rank must be unique per (theme_id, user_id)
- Rating percent: 0-100 range

---

## 2. MIGRATION STRATEGY

### 2.1 Drizzle Schema Extension
**File**: `drizzle/schema.ts`

Add new tables alongside existing auth tables:
- `pillars` table definition
- `themes` table definition
- `tasks` table definition
- Foreign key relationships
- Indexes for performance

### 2.2 Migration Generation
```bash
npm run db:generate  # Creates migration file
npm run db:migrate   # Applies to database
```

### 2.3 Seed Data Migration
**File**: `scripts/seed-life-planner.ts` (NEW)

Create script to:
1. Read initial seed data from `src/store/useLifeOSStore.ts`
2. Transform to database format
3. Insert with proper user_id association
4. Verify data integrity

---

## 3. SERVICE LAYER IMPLEMENTATION

### 3.1 Database Service Layer
**Directory**: `src/lib/services/` (NEW)

#### `pillars.service.ts`
- `getPillars(userId: string): Promise<Pillar[]>`
- `getPillar(id: string, userId: string): Promise<Pillar>`
- `createPillar(data: CreatePillarInput, userId: string): Promise<Pillar>`
- `updatePillar(id: string, data: UpdatePillarInput, userId: string): Promise<Pillar>`
- `deletePillar(id: string, userId: string): Promise<void>`
- `recalculateAverage(pillarId: string, userId: string): Promise<void>`

#### `themes.service.ts`
- `getThemes(userId: string): Promise<Theme[]>`
- `getThemesByPillar(pillarId: string, userId: string): Promise<Theme[]>`
- `createTheme(data: CreateThemeInput, userId: string): Promise<Theme>`
- `updateTheme(id: string, data: UpdateThemeInput, userId: string): Promise<Theme>`
- `deleteTheme(id: string, userId: string): Promise<void>`

#### `tasks.service.ts`
- `getTasks(userId: string): Promise<Task[]>`
- `getTasksByTheme(themeId: string, userId: string): Promise<Task[]>`
- `createTask(data: CreateTaskInput, userId: string): Promise<Task>`
- `updateTask(id: string, data: UpdateTaskInput, userId: string): Promise<Task>`
- `deleteTask(id: string, userId: string): Promise<void>`
- `reorderTasks(themeId: string, tasks: Task[], userId: string): Promise<void>`

### 3.2 API Routes
**Directory**: `app/api/life-planner/` (NEW)

```
/api/life-planner/
  /pillars/
    GET    - list all pillars
    POST   - create pillar
    /[id]/
      GET    - get pillar
      PATCH  - update pillar
      DELETE - delete pillar
  /themes/
    GET    - list all themes
    POST   - create theme
    /[id]/
      GET    - get theme
      PATCH  - update theme
      DELETE - delete theme
  /tasks/
    GET    - list all tasks
    POST   - create task
    /[id]/
      GET    - get task
      PATCH  - update task
      DELETE - delete task
    /reorder
      POST   - reorder tasks in theme
```

---

## 4. ZUSTAND STORE MIGRATION

### 4.1 Store Architecture Changes

**Current**: In-memory only
**New**: Hybrid approach with optimistic updates

#### Store Structure
```typescript
interface LifeOSState {
  // Data
  pillars: Pillar[]
  themes: Theme[]
  tasks: Task[]
  
  // UI State
  selectedPillarId: string | null
  selectedThemeIds: string[]
  selectedTaskId: string | null
  
  // Loading/Error states
  isLoading: boolean
  error: string | null
  
  // Sync state
  pendingChanges: Map<string, PendingChange>
  
  // Actions (now call API)
  fetchPillars: () => Promise<void>
  addPillar: (pillar: CreatePillarInput) => Promise<Pillar>
  updatePillar: (id: string, updates: UpdatePillarInput) => Promise<void>
  deletePillar: (id: string) => Promise<void>
  // ... similar for themes and tasks
}
```

### 4.2 Optimistic Update Pattern
1. Update local state immediately
2. Call API in background
3. On success: confirm (no action needed)
4. On error: rollback local state + show error toast

### 4.3 Implementation Phases
- **Phase 2a**: Add API calls alongside in-memory store
- **Phase 2b**: Implement optimistic updates
- **Phase 2c**: Remove in-memory fallback

---

## 5. TESTING STRATEGY

### 5.1 Unit Tests
- Service layer functions (pillars, themes, tasks)
- Store actions with mocked API
- Data transformation logic

### 5.2 Integration Tests
- API routes with test database
- Store + API integration
- Optimistic update rollback scenarios

### 5.3 E2E Tests
- Full user workflows (create pillar → add themes → add tasks)
- Data persistence across sessions
- Error handling and recovery

### 5.4 Coverage Target
- 90%+ overall coverage
- 100% coverage for critical paths (CRUD operations)

---

## 6. IMPLEMENTATION TIMELINE

### Week 1: Schema & Infrastructure
- [ ] Design & implement Drizzle schema
- [ ] Generate migrations
- [ ] Create seed script
- [ ] Set up service layer structure

### Week 2: API Routes & Services
- [ ] Implement all service functions
- [ ] Create API routes
- [ ] Add error handling & validation
- [ ] Write unit tests

### Week 3: Store Integration
- [ ] Update Zustand store with API calls
- [ ] Implement optimistic updates
- [ ] Add loading/error states
- [ ] Write integration tests

### Week 4: Testing & Polish
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Error handling refinement
- [ ] Documentation

---

## 7. RISK MITIGATION

### Data Loss Prevention
- Backup seed data before migration
- Validate data integrity post-migration
- Keep in-memory store as fallback initially

### Performance
- Add database indexes for common queries
- Implement pagination for large datasets
- Use connection pooling (Neon handles this)

### User Experience
- Optimistic updates for instant feedback
- Loading states during API calls
- Error toasts with retry options
- Graceful degradation if DB unavailable

---

## 8. SUCCESS CRITERIA

✅ All 73 tasks, 25 themes, 5 pillars persisted in database
✅ CRUD operations work identically to in-memory version
✅ Data persists across browser sessions
✅ Optimistic updates provide instant feedback
✅ 90%+ test coverage
✅ Zero breaking changes for users
✅ API response times < 200ms (p95)
✅ Proper error handling & recovery

