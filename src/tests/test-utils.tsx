import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Notifications } from '@mantine/notifications';

/**
 * Creates a new QueryClient instance for each test
 * This ensures tests don't share cache and remain isolated
 * 
 * @example
 * ```tsx
 * const queryClient = createTestQueryClient();
 * // Customize if needed
 * queryClient.setDefaultOptions({ queries: { staleTime: 1000 } });
 * ```
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        gcTime: Infinity, // Don't garbage collect during tests
      },
      mutations: {
        retry: false, // Don't retry failed mutations in tests
      },
    },
  });
}

interface AllTheProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper component that includes all app providers
 * Use this for components that don't need routing
 */
function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Notifications />
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

/**
 * Custom render function that wraps components with all necessary providers
 * 
 * @example
 * ```tsx
 * import { render, screen } from '@/tests/test-utils';
 * 
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial route(s) for the test
   * @default ['/']
   */
  initialEntries?: string[];
  /**
   * Initial index for the history stack
   * @default 0
   */
  initialIndex?: number;
  /**
   * Route path to match (e.g., '/contact/:id')
   */
  path?: string;
}

/**
 * Render a component with routing support
 * Useful for testing components that use useParams, useNavigate, etc.
 * 
 * @example
 * ```tsx
 * import { renderWithRouter, screen } from '@/tests/test-utils';
 * 
 * test('renders contact page with id param', () => {
 *   renderWithRouter(<ContactDashboard />, {
 *     path: '/contact/:id',
 *     initialEntries: ['/contact/c1']
 *   });
 *   expect(screen.getByText('Thabo Mbeki')).toBeInTheDocument();
 * });
 * ```
 */
function renderWithRouter(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    initialIndex = 0,
    path = '/',
    ...options
  }: RenderWithRouterOptions = {}
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Notifications />
            <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
              <Routes>
                <Route path={path} element={children} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </MantineProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderHook } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Export custom render functions
export { customRender as render, renderWithRouter };

