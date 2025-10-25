import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Container, Loader, Stack, Text } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <Container size="xs">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading...</Text>
          </Stack>
        </Container>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

