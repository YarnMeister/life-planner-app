import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/theme/mantine-theme';

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
 * Use this for testing components that need app context
 */
function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
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

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderHook } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Export custom render function
export { customRender as render };
