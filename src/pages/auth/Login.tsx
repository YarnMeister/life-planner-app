import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, TextInput, Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMail } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { requestCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      notifications.show({
        title: 'Error',
        message: 'Please enter your email address',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);

    try {
      await requestCode(email);
      
      notifications.show({
        title: 'Code sent!',
        message: 'Check your email for the authentication code',
        color: 'green',
      });

      // Navigate to verify page with email in state
      navigate('/auth/verify', { state: { email } });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send code',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Container size="xs">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} mb="sm">
                Welcome to App Template
              </Title>
              <Text c="dimmed" size="sm">
                Enter your email to receive a login code
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email address"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  size="md"
                  required
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={!email}
                >
                  Send login code
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

