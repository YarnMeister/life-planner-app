'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Paper, Title, Text, Button, Stack, PinInput, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function VerifyPageContent() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, requestCode } = useAuth();
  
  const email = searchParams.get('email');

  // Redirect back to login if no email in query
  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      notifications.show({
        title: 'Error',
        message: 'Please enter the complete 6-digit code',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await login(email, code);

      notifications.show({
        title: 'Success',
        message: 'Login successful! Redirecting...',
        color: 'green',
      });

      // Redirect to home page
      router.push('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Invalid or expired code',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      await requestCode(email);

      notifications.show({
        title: 'Code Sent',
        message: 'A new verification code has been sent to your email',
        color: 'blue',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to resend code',
        color: 'red',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <Container size="xs">
          <Paper shadow="lg" p="xl" radius="lg" withBorder>
            <Stack gap="md">
              <Title order={3} ta="center">
                Redirecting...
              </Title>
            </Stack>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="xs">
        <Paper shadow="lg" p="xl" radius="lg" withBorder>
          <Stack gap="lg">
            <div>
              <Title order={2} ta="center" mb="sm">
                Verify Your Code
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                We sent a 6-digit code to
              </Text>
              <Text size="sm" c="dimmed" ta="center" fw={600}>
                {email}
              </Text>
            </div>

            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Enter Code
                </Text>
                <Group justify="center">
                  <PinInput
                    length={6}
                    value={code}
                    onChange={setCode}
                    placeholder="0"
                    size="lg"
                    type="number"
                    autoFocus
                    onComplete={handleVerify}
                  />
                </Group>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={handleVerify}
                loading={isLoading}
                disabled={code.length !== 6}
              >
                Verify Code
              </Button>

              <Stack gap="xs">
                <Text size="sm" c="dimmed" ta="center">
                  Didn't receive a code?
                </Text>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={handleResendCode}
                  loading={isResending}
                >
                  Resend Code
                </Button>
              </Stack>
            </Stack>

            <Button
              component={Link}
              href="/login"
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              fullWidth
            >
              Back to Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
