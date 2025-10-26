# Phase 2: Detailed Task Breakdown

## PHASE 2A: SCHEMA & INFRASTRUCTURE (Week 1)

### Task 2A.1: Design Drizzle Schema
**Objective**: Create complete database schema for life-planner data

**Deliverables**:
- [ ] Extend `drizzle/schema.ts` with:
  - `pillars` table (id, user_id, name, color, domain, avg_percent, timestamps)
  - `themes` table (id, user_id, pillar_id, name, rating_percent, reflection_note, previous_rating, timestamps)
  - `tasks` table (id, user_id, pillar_id, theme_id, title, description, time_estimate, impact, status, due_date, rank, notes, task_type, recurrence_*, timestamps)
- [ ] Define all foreign keys with CASCADE delete
- [ ] Add indexes for common queries
- [ ] Add constraints (rating 0-100, enum types)

**Acceptance Criteria**:
- Schema compiles without errors
- All relationships properly defined
- Indexes cover all query patterns
- Type inference works correctly

**Estimated Time**: 2-3 hours

---

### Task 2A.2: Generate & Test Migrations
**Objective**: Create and validate database migrations

**Deliverables**:
- [ ] Run `npm run db:generate` to create migration file
- [ ] Review generated SQL for correctness
- [ ] Test migration on staging database
- [ ] Verify schema matches design
- [ ] Document any manual adjustments

**Acceptance Criteria**:
- Migration file created in `drizzle/migrations/`
- Migration applies cleanly to test database
- All tables created with correct columns
- Indexes created successfully
- No SQL errors or warnings

**Estimated Time**: 1-2 hours

---

### Task 2A.3: Create Seed Data Script
**Objective**: Migrate existing seed data to database

**Deliverables**:
- [ ] Create `scripts/seed-life-planner.ts`:
  - Extract seed data from `src/store/useLifeOSStore.ts`
  - Transform to database format
  - Generate UUIDs for all records
  - Insert with proper relationships
- [ ] Add verification queries:
  - Count pillars (should be 5)
  - Count themes (should be 25)
  - Count tasks (should be 73)
  - Verify foreign key relationships
- [ ] Add rollback capability

**Acceptance Criteria**:
- Script runs without errors
- All 73 tasks inserted
- All 25 themes inserted
- All 5 pillars inserted
- All relationships intact
- Verification queries pass

**Estimated Time**: 2-3 hours

---

### Task 2A.4: Set Up Service Layer Structure
**Objective**: Create directory structure and base classes

**Deliverables**:
- [ ] Create `src/lib/services/` directory
- [ ] Create base service class with common patterns
- [ ] Create `pillars.service.ts` skeleton
- [ ] Create `themes.service.ts` skeleton
- [ ] Create `tasks.service.ts` skeleton
- [ ] Add TypeScript interfaces for inputs/outputs

**Acceptance Criteria**:
- Directory structure created
- All service files exist
- Interfaces properly typed
- No compilation errors

**Estimated Time**: 1 hour

---

## PHASE 2B: API ROUTES & SERVICES (Week 2)

### Task 2B.1: Implement Pillars Service
**Objective**: Complete CRUD operations for pillars

**Deliverables**:
- [ ] `getPillars(userId)` - fetch all pillars
- [ ] `getPillar(id, userId)` - fetch single pillar
- [ ] `createPillar(data, userId)` - create new pillar
- [ ] `updatePillar(id, data, userId)` - update pillar
- [ ] `deletePillar(id, userId)` - delete pillar with cascade
- [ ] `recalculateAverage(pillarId, userId)` - compute avg from themes
- [ ] Error handling for all operations
- [ ] Input validation

**Acceptance Criteria**:
- All functions implemented
- Proper error handling
- User isolation enforced
- Cascade delete works
- Average calculation correct

**Estimated Time**: 3-4 hours

---

### Task 2B.2: Implement Themes Service
**Objective**: Complete CRUD operations for themes

**Deliverables**:
- [ ] `getThemes(userId)` - fetch all themes
- [ ] `getThemesByPillar(pillarId, userId)` - fetch themes for pillar
- [ ] `createTheme(data, userId)` - create new theme
- [ ] `updateTheme(id, data, userId)` - update theme
- [ ] `deleteTheme(id, userId)` - delete theme with cascade
- [ ] Trigger pillar average recalculation on update
- [ ] Error handling and validation

**Acceptance Criteria**:
- All functions implemented
- Pillar average updates on theme change
- User isolation enforced
- Cascade delete works

**Estimated Time**: 3-4 hours

---

### Task 2B.3: Implement Tasks Service
**Objective**: Complete CRUD operations for tasks

**Deliverables**:
- [ ] `getTasks(userId)` - fetch all tasks
- [ ] `getTasksByTheme(themeId, userId)` - fetch tasks for theme
- [ ] `createTask(data, userId)` - create new task
- [ ] `updateTask(id, data, userId)` - update task
- [ ] `deleteTask(id, userId)` - delete task
- [ ] `reorderTasks(themeId, tasks, userId)` - update rank for multiple tasks
- [ ] Error handling and validation

**Acceptance Criteria**:
- All functions implemented
- Rank ordering works correctly
- User isolation enforced
- Batch reorder works

**Estimated Time**: 3-4 hours

---

### Task 2B.4: Create API Routes
**Objective**: Implement REST endpoints for all operations

**Deliverables**:
- [ ] Create `app/api/life-planner/` directory structure
- [ ] Implement pillar routes:
  - `GET /api/life-planner/pillars`
  - `POST /api/life-planner/pillars`
  - `GET /api/life-planner/pillars/[id]`
  - `PATCH /api/life-planner/pillars/[id]`
  - `DELETE /api/life-planner/pillars/[id]`
- [ ] Implement theme routes (similar structure)
- [ ] Implement task routes (similar structure)
- [ ] Add reorder endpoint: `POST /api/life-planner/tasks/reorder`
- [ ] Add authentication middleware
- [ ] Add error handling middleware

**Acceptance Criteria**:
- All routes implemented
- Authentication enforced
- Proper HTTP status codes
- Error responses formatted consistently
- Request/response validation

**Estimated Time**: 4-5 hours

---

### Task 2B.5: Add Validation & Error Handling
**Objective**: Implement comprehensive validation and error handling

**Deliverables**:
- [ ] Create Zod schemas for all inputs
- [ ] Add request validation middleware
- [ ] Implement typed error classes
- [ ] Add error response formatting
- [ ] Add logging for debugging
- [ ] Handle edge cases (not found, unauthorized, etc.)

**Acceptance Criteria**:
- All inputs validated
- Clear error messages
- Proper HTTP status codes
- Errors logged appropriately

**Estimated Time**: 2-3 hours

---

### Task 2B.6: Write Service Layer Unit Tests
**Objective**: Test all service functions

**Deliverables**:
- [ ] Create `src/lib/services/__tests__/` directory
- [ ] Test pillars service (all functions)
- [ ] Test themes service (all functions)
- [ ] Test tasks service (all functions)
- [ ] Test error conditions
- [ ] Test user isolation
- [ ] Achieve 100% coverage

**Acceptance Criteria**:
- All tests pass
- 100% code coverage
- Edge cases covered
- Error scenarios tested

**Estimated Time**: 4-5 hours

---

## PHASE 2C: STORE INTEGRATION (Week 3)

### Task 2C.1: Update Zustand Store Structure
**Objective**: Add async support and loading states

**Deliverables**:
- [ ] Add to `src/store/useLifeOSStore.ts`:
  - `isLoading: boolean`
  - `error: string | null`
  - `pendingChanges: Map<string, 'pending' | 'error'>`
- [ ] Update all action signatures to return Promise
- [ ] Add `setLoading()` and `setError()` actions
- [ ] Keep existing state structure for compatibility

**Acceptance Criteria**:
- Store compiles
- New state properties accessible
- No breaking changes to existing code

**Estimated Time**: 1-2 hours

---

### Task 2C.2: Implement API Integration
**Objective**: Connect store actions to API endpoints

**Deliverables**:
- [ ] Update pillar actions to call API
- [ ] Update theme actions to call API
- [ ] Update task actions to call API
- [ ] Add fetch on store initialization
- [ ] Handle API errors gracefully

**Acceptance Criteria**:
- All actions call correct API endpoints
- Data fetched on app load
- Errors handled properly

**Estimated Time**: 3-4 hours

---

### Task 2C.3: Implement Optimistic Updates
**Objective**: Update UI immediately, sync with API in background

**Deliverables**:
- [ ] Implement optimistic update pattern for:
  - `addPillar`, `updatePillar`, `deletePillar`
  - `addTheme`, `updateTheme`, `deleteTheme`
  - `addTask`, `updateTask`, `deleteTask`
- [ ] Save previous state for rollback
- [ ] Rollback on API error
- [ ] Show error toast on failure
- [ ] Mark pending changes in UI

**Acceptance Criteria**:
- Updates appear immediately
- Rollback works on error
- Error messages shown
- No data loss

**Estimated Time**: 4-5 hours

---

### Task 2C.4: Add Loading & Error States
**Objective**: Provide user feedback during operations

**Deliverables**:
- [ ] Add loading indicators to UI components
- [ ] Show error messages in toasts
- [ ] Disable buttons during loading
- [ ] Show retry options on error
- [ ] Add pending state visual indicators

**Acceptance Criteria**:
- Loading states visible
- Error messages clear
- UI responsive during operations
- Retry functionality works

**Estimated Time**: 2-3 hours

---

### Task 2C.5: Write Store Integration Tests
**Objective**: Test store with API integration

**Deliverables**:
- [ ] Create `src/store/__tests__/` directory
- [ ] Mock API responses
- [ ] Test optimistic updates
- [ ] Test rollback scenarios
- [ ] Test error handling
- [ ] Test state consistency

**Acceptance Criteria**:
- All tests pass
- 80%+ coverage
- Edge cases covered
- Mocks work correctly

**Estimated Time**: 3-4 hours

---

## PHASE 2D: TESTING & DEPLOYMENT (Week 4)

### Task 2D.1: Write E2E Tests
**Objective**: Test complete user workflows

**Deliverables**:
- [ ] Create `src/tests/e2e/` directory
- [ ] Test: Create pillar → Add themes → Add tasks
- [ ] Test: Update task status
- [ ] Test: Delete pillar (cascade)
- [ ] Test: Data persistence across sessions
- [ ] Test: Error recovery

**Acceptance Criteria**:
- All workflows tested
- Tests pass consistently
- Data persists correctly

**Estimated Time**: 3-4 hours

---

### Task 2D.2: Performance Testing
**Objective**: Verify API response times and database performance

**Deliverables**:
- [ ] Measure API response times
- [ ] Test with full dataset (73 tasks)
- [ ] Verify index effectiveness
- [ ] Check database query times
- [ ] Document performance metrics

**Acceptance Criteria**:
- API responses < 200ms (p95)
- Database queries < 100ms
- No N+1 queries
- Indexes working

**Estimated Time**: 2-3 hours

---

### Task 2D.3: Deploy to Production
**Objective**: Release Phase 2 to production

**Deliverables**:
- [ ] Deploy schema migrations
- [ ] Run seed script on production
- [ ] Verify data integrity
- [ ] Deploy API routes
- [ ] Deploy updated store
- [ ] Monitor for errors

**Acceptance Criteria**:
- All data migrated
- API working
- No errors in logs
- Users can access data

**Estimated Time**: 2-3 hours

---

### Task 2D.4: Monitoring & Optimization
**Objective**: Monitor production and optimize as needed

**Deliverables**:
- [ ] Set up error tracking
- [ ] Monitor API performance
- [ ] Track database metrics
- [ ] Optimize slow queries
- [ ] Document lessons learned

**Acceptance Criteria**:
- Monitoring in place
- No critical errors
- Performance acceptable
- Documentation complete

**Estimated Time**: 2-3 hours

---

## SUMMARY

| Phase | Tasks | Estimated Hours | Week |
|-------|-------|-----------------|------|
| 2A | 4 | 8-11 | 1 |
| 2B | 6 | 19-24 | 2 |
| 2C | 5 | 13-17 | 3 |
| 2D | 4 | 9-13 | 4 |
| **Total** | **19** | **49-65** | **4** |

**Effort Estimate**: 7-8 weeks (1 developer, full-time)
**Buffer**: 20% for unknowns and refinement

