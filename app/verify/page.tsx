'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Paper, Title, Text, Button, Stack, PinInput, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function VerifyPage() {
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
      await login(email!, code);
      
      notifications.show({
        title: 'Success!',
        message: 'You have been logged in',
        color: 'green',
      });

      router.push('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Invalid or expired code',
        color: 'red',
      });
      setCode(''); // Clear the code input
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      await requestCode(email);
      
      notifications.show({
        title: 'Code sent!',
        message: 'Check your email for the authentication code',
        color: 'green',
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

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="xs">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div style={{ textAlign: 'center' }}>
              <Title order={2} mb="sm">
                Enter verification code
              </Title>
              <Text c="dimmed" size="sm">
                We sent a 6-digit code to
              </Text>
              <Text fw={600} size="sm">
                {email}
              </Text>
            </div>

            <Stack gap="md" align="center">
              <PinInput
                length={6}
                value={code}
                onChange={setCode}
                size="lg"
                type="number"
                oneTimeCode
                autoFocus
              />

              <Button
                size="md"
                fullWidth
                onClick={handleVerify}
                loading={isLoading}
                disabled={code.length !== 6}
              >
                Verify code
              </Button>

              <Button
                variant="subtle"
                size="sm"
                onClick={handleResend}
                loading={isResending}
              >
                Resend code
              </Button>

              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Group gap="xs">
                  <IconArrowLeft size={16} />
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    Change email
                  </Text>
                </Group>
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

