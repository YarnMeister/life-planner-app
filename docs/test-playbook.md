# Unit Testing Playbook
## React + Vite + TypeScript + Vitest

**Purpose:** Consistent testing patterns for AI coding assistants to follow across all projects.

---

## Core Rules for AI Assistants

```
RULE 1: Tests live next to the code they test
RULE 2: Mock external dependencies (APIs, database) - never use real data
RULE 3: Each test file is independent (no shared state between tests)
RULE 4: Use MSW for ALL API mocking (one consistent pattern)
RULE 5: Copy existing patterns - don't invent new approaches
```

---

## File Structure Pattern

```
app/modules/sales-requests/
├── components/
│   ├── RequestForm.tsx
│   └── RequestForm.test.tsx          ← Test next to component
├── hooks/
│   ├── useRequest.ts
│   └── useRequest.test.ts            ← Test next to hook
├── utils/
│   ├── validation.ts
│   └── validation.test.ts            ← Test next to utility
└── api/
    ├── route.ts
    └── route.test.ts                 ← Test next to API route
```

**Why this structure?**
- Clear "blast radius" - when code changes, you immediately see which tests are affected
- No hunting through nested `__tests__` folders
- Easy for AI to correlate failures with changed files

---

## Test Setup (Required in Every Test File)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// REQUIRED: Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

---

## Recipe A: Testing Pure Functions / Utils

**When to use:** Functions with no side effects (validation, formatting, calculations)

```typescript
// utils/validation.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validation';

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
```

**Pattern:**
1. Import function to test
2. Describe what it does
3. Test happy path + 1-2 edge cases
4. No mocking needed (pure function)

---

## Recipe B: Testing React Components

**When to use:** UI components, forms, interactive elements

```typescript
// components/ContactCard.tsx
interface ContactCardProps {
  name: string;
  email: string;
  onDelete: () => void;
}

export function ContactCard({ name, email, onDelete }: ContactCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

// components/ContactCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactCard } from './ContactCard';

describe('ContactCard', () => {
  it('renders contact information', () => {
    render(
      <ContactCard 
        name="John Doe" 
        email="john@example.com" 
        onDelete={vi.fn()} 
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', async () => {
    const mockDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <ContactCard 
        name="John Doe" 
        email="john@example.com" 
        onDelete={mockDelete} 
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));
    
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
```

**Pattern:**
1. Render component with props
2. Test what user sees (use `screen.getByText`, `getByRole`)
3. Test interactions with `userEvent`
4. Mock callback functions with `vi.fn()`

---

## Recipe C: Testing Custom Hooks

**When to use:** Reusable logic hooks (useForm, useAuth, useData)

```typescript
// hooks/useCounter.ts
import { useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  
  return { count, increment, decrement, reset };
}

// hooks/useCounter.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

**Pattern:**
1. Use `renderHook` from `@testing-library/react`
2. Wrap state changes in `act()`
3. Access hook values via `result.current`
4. Test initial state + actions

---

## Recipe D: Testing API Calls with MSW

**When to use:** Components/hooks that fetch data from APIs

### Step 1: Global MSW Setup (One-time)

```typescript
// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer();

// tests/setup.ts (Vitest config: setupFiles)
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Step 2: Mock Handlers (Per Module)

```typescript
// modules/contacts/__tests__/handlers.ts
import { http, HttpResponse } from 'msw';

export const contactHandlers = [
  // GET contacts
  http.get('/api/v2/contacts/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
      siteId: 'site-123'
    });
  }),

  // POST note
  http.post('/api/v2/notes', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'note-456',
      contactId: body.contactId,
      body: body.body,
      createdAt: new Date().toISOString()
    });
  }),
];
```

### Step 3: Use in Tests

```typescript
// components/ContactDetails.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../tests/mocks/server';
import { contactHandlers } from '../__tests__/handlers';
import { ContactDetails } from './ContactDetails';

describe('ContactDetails', () => {
  beforeEach(() => {
    server.use(...contactHandlers);
  });

  it('loads and displays contact data', async () => {
    render(<ContactDetails contactId="123" />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Override handler for this test
    server.use(
      http.get('/api/v2/contacts/:id', () => {
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      })
    );

    render(<ContactDetails contactId="999" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading contact/i)).toBeInTheDocument();
    });
  });
});
```

**Pattern:**
1. Create module-specific handlers in `__tests__/handlers.ts`
2. Use `server.use(...handlers)` in `beforeEach`
3. Test loading states, success states, error states
4. Override handlers per test when needed

---

## Recipe E: Mocking Database Calls (Drizzle)

**When to use:** Testing API routes or server functions that query the database

```typescript
// api/contacts/route.ts
import { db } from '@/lib/db';
import { contacts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const contact = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);
    
  return Response.json(contact[0]);
}

// api/contacts/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Mock the entire db module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn()
  }
}));

import { db } from '@/lib/db';

describe('GET /api/contacts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns contact by id', async () => {
    // Mock the database response
    vi.mocked(db.limit).mockResolvedValue([
      {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        siteId: 'site-456'
      }
    ]);

    const request = new Request('http://localhost/api/contacts?id=123');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      siteId: 'site-456'
    });
  });

  it('returns empty when contact not found', async () => {
    vi.mocked(db.limit).mockResolvedValue([]);

    const request = new Request('http://localhost/api/contacts?id=999');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toBeUndefined();
  });
});
```

**Pattern:**
1. Mock `@/lib/db` at the top of test file
2. Chain mock methods (`.mockReturnThis()` for query builders)
3. Mock final method (`.limit`, `.execute`) with `mockResolvedValue`
4. Test with different mock data per test

**Alternative for complex queries:**

```typescript
// For queries with joins/aggregations
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      contacts: {
        findFirst: vi.fn(),
        findMany: vi.fn()
      },
      sites: {
        findFirst: vi.fn()
      }
    }
  }
}));

// In test
vi.mocked(db.query.contacts.findFirst).mockResolvedValue({
  id: '123',
  name: 'John Doe',
  site: { name: 'Mine ABC' }
});
```

---

## Common Patterns Library

### Testing Forms

```typescript
it('validates required fields', async () => {
  const user = userEvent.setup();
  render(<ContactForm onSubmit={vi.fn()} />);

  // Submit without filling form
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Check for validation errors
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

it('submits valid data', async () => {
  const mockSubmit = vi.fn();
  const user = userEvent.setup();
  
  render(<ContactForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Testing Async Operations

```typescript
it('shows loading state during API call', async () => {
  render(<ContactList />);

  // Check initial loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  // Check data is displayed
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Testing Conditional Rendering

```typescript
it('shows delete button only for authorized users', () => {
  render(<ContactCard isAuthorized={true} />);
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
});

it('hides delete button for unauthorized users', () => {
  render(<ContactCard isAuthorized={false} />);
  expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
});
```

---

## Common Mistakes to Avoid

### ❌ DON'T: Test implementation details

```typescript
// BAD - testing internal state
it('updates state correctly', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
  // Don't care HOW it stores the count, just that it works
});
```

### ✅ DO: Test behavior

```typescript
// GOOD - testing user-facing behavior
it('displays incremented count', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### ❌ DON'T: Mock everything

```typescript
// BAD - over-mocking makes tests brittle
vi.mock('./utils/format');
vi.mock('./utils/validate');
vi.mock('./utils/calculate');
```

### ✅ DO: Only mock external dependencies

```typescript
// GOOD - only mock database and APIs
vi.mock('@/lib/db');
// Use real utils (they're tested separately)
```

### ❌ DON'T: Use real database/API data

```typescript
// BAD - tests will break if data changes
it('loads real contact from database', async () => {
  const contact = await db.query.contacts.findFirst();
  expect(contact.name).toBe('John Doe'); // Fragile!
});
```

### ✅ DO: Use mocked data

```typescript
// GOOD - controlled test data
vi.mocked(db.query.contacts.findFirst).mockResolvedValue({
  id: '123',
  name: 'Test Contact',
  email: 'test@example.com'
});
```

---

## Quick Reference: What to Test

### ✅ Always Test
- User interactions (clicks, form inputs, navigation)
- Data fetching (loading, success, error states)
- Validation logic
- Conditional rendering
- Error boundaries

### ⏭️ Usually Skip
- Third-party library internals
- CSS styles (unless critical to functionality)
- Exact text content (test by role/label instead)
- Implementation details (private methods, internal state)

---

## Debugging Failed Tests

### Test fails with "Cannot find element"
```typescript
// Use screen.debug() to see what's rendered
it('displays contact name', () => {
  render(<ContactCard name="John" />);
  screen.debug(); // Prints entire DOM tree
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

### Test fails with "Act warning"
```typescript
// Wrap state changes in act() or use waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Mock not working
```typescript
// Ensure mock is called BEFORE importing component
vi.mock('@/lib/db');
import { MyComponent } from './MyComponent'; // Import after mock
```

---

## Project-Specific Patterns

### Mocking Pipedrive API Calls

```typescript
// modules/pipedrive/__tests__/handlers.ts
import { http, HttpResponse } from 'msw';

export const pipedriveHandlers = [
  http.get('https://api.pipedrive.com/v1/persons/:id', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 123,
        name: 'John Doe',
        email: [{ value: 'john@example.com', primary: true }],
        org_id: 456
      }
    });
  }),
];
```

### Mocking RetellAI Transcription

```typescript
export const retellHandlers = [
  http.post('/api/v2/retellai/webhook', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      transcript: 'Test transcription',
      confidence: 0.95
    });
  }),
];
```

### Testing Service Level Calculation

```typescript
// utils/serviceLevelCalculator.test.ts
import { calculateServiceTier } from './serviceLevelCalculator';

describe('calculateServiceTier', () => {
  it('assigns Gold tier for high revenue + well-served + growth', () => {
    const result = calculateServiceTier({
      revenue12m: 1200000, // R3
      visits3m: 6,         // WELL-SERVED
      growthPotential: 'Grow'
    });
    
    expect(result.tier).toBe('G');
    expect(result.score).toBe(5); // 3 + 1 + 1
  });

  it('assigns Bronze tier for low revenue + under-served', () => {
    const result = calculateServiceTier({
      revenue12m: 400000,  // R0
      visits3m: 1,         // UNDER-SERVED
      growthPotential: 'Sustain'
    });
    
    expect(result.tier).toBe('B');
    expect(result.score).toBe(-1); // 0 - 1 + 0
  });
});
```

---

## File Naming Convention

```
✅ ContactCard.test.tsx
✅ useRequest.test.ts
✅ validation.test.ts

❌ ContactCard.spec.tsx
❌ test-ContactCard.tsx
❌ __tests__/ContactCard.tsx
```

**Rule:** Always use `[filename].test.[ext]` next to the source file.

---

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests for specific file
npm run test ContactCard.test.tsx

# Run tests with coverage
npm run test:coverage
```

---

## When to Write Tests

1. **Always:** When creating new components, hooks, or utilities
2. **Always:** When fixing bugs (add test that reproduces bug first)
3. **Always:** When modifying existing logic (ensure tests still pass)
4. **Consider:** When refactoring (tests prove behavior unchanged)

**Coverage Goals:**
- Write tests for happy path + 1-2 edge cases
- Don't aim for 100% - focus on critical paths
- If a test feels hard to write, the code might need refactoring

---

## Summary Checklist

- [ ] Test file lives next to source file
- [ ] Uses appropriate recipe (A, B, C, D, or E)
- [ ] Includes `afterEach` cleanup
- [ ] Mocks external dependencies only (API, database)
- [ ] Tests user-facing behavior, not implementation
- [ ] Uses MSW for API mocking (not `vi.mock(fetch)`)
- [ ] Uses Drizzle mock pattern for database
- [ ] Tests happy path + error case
- [ ] Follows existing patterns in codebase