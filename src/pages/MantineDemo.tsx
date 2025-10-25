import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Card, 
  Group, 
  Button, 
  TextInput, 
  Badge,
  Alert,
  Paper,
  Divider,
} from '@mantine/core';
import { 
  IconCheck, 
  IconInfoCircle, 
  IconAlertCircle,
  IconSend,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';

const MantineDemo = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header Section */}
        <Paper p="xl" shadow="sm" radius="md">
          <Stack gap="md">
            <Title order={1} c="blue">Mantine UI Demo</Title>
            <Text size="lg" c="dimmed">
              This page demonstrates the Mantine UI components configured in this template.
              All components use the blue theme defined in <code>src/theme/mantine-theme.ts</code>.
            </Text>
          </Stack>
        </Paper>

        {/* Typography Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2}>Typography</Title>
            <Divider />
            <Title order={1}>Heading 1</Title>
            <Title order={2}>Heading 2</Title>
            <Title order={3}>Heading 3</Title>
            <Title order={4}>Heading 4</Title>
            <Text size="lg">Large text</Text>
            <Text>Regular text</Text>
            <Text size="sm">Small text</Text>
            <Text size="xs" c="dimmed">Extra small dimmed text</Text>
          </Stack>
        </Card>

        {/* Form Components Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2}>Form Components</Title>
            <Divider />
            
            <TextInput
              label="Text Input"
              placeholder="Enter your name"
              leftSection={<IconUser size={16} />}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <Group>
              <Button variant="filled" leftSection={<IconSend size={16} />}>
                Primary Button
              </Button>
              <Button variant="outline">
                Outline Button
              </Button>
              <Button variant="light">
                Light Button
              </Button>
              <Button variant="subtle">
                Subtle Button
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Badges Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2}>Badges</Title>
            <Divider />
            
            <Group>
              <Badge color="blue" variant="filled">Blue</Badge>
              <Badge color="green" variant="filled">Success</Badge>
              <Badge color="yellow" variant="filled">Warning</Badge>
              <Badge color="red" variant="filled">Error</Badge>
              <Badge color="gray" variant="filled">Neutral</Badge>
            </Group>

            <Group>
              <Badge color="blue" variant="light">Blue Light</Badge>
              <Badge color="green" variant="light">Success Light</Badge>
              <Badge color="yellow" variant="light">Warning Light</Badge>
              <Badge color="red" variant="light">Error Light</Badge>
            </Group>

            <Group>
              <Badge color="blue" variant="outline">Blue Outline</Badge>
              <Badge color="green" variant="outline">Success Outline</Badge>
              <Badge color="yellow" variant="outline">Warning Outline</Badge>
              <Badge color="red" variant="outline">Error Outline</Badge>
            </Group>
          </Stack>
        </Card>

        {/* Alerts Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2}>Alerts</Title>
            <Divider />
            
            <Alert 
              icon={<IconCheck size={16} />} 
              title="Success!" 
              color="green"
            >
              Your changes have been saved successfully.
            </Alert>

            <Alert 
              icon={<IconInfoCircle size={16} />} 
              title="Information" 
              color="blue"
            >
              This is an informational message to help guide you.
            </Alert>

            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Warning" 
              color="yellow"
            >
              Please review your input before proceeding.
            </Alert>

            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red"
            >
              Something went wrong. Please try again.
            </Alert>
          </Stack>
        </Card>

        {/* Usage Instructions */}
        <Paper p="lg" shadow="sm" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Next Steps</Title>
            <Text>
              All Mantine components shown above are ready to use in your application. 
              Simply import them from <code>@mantine/core</code> and start building your UI.
            </Text>
            <Text>
              For icons, import from <code>@tabler/icons-react</code>.
            </Text>
            <Text>
              To customize the theme colors, edit <code>src/theme/mantine-theme.ts</code>.
            </Text>
            <Text c="dimmed" size="sm">
              📚 Full documentation: <code>/docs/mantine-setup.md</code>
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default MantineDemo;

