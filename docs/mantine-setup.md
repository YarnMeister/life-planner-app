# Mantine UI Setup Guide

This template comes with Mantine UI pre-configured and ready to use. This guide explains how to use Mantine components and customize the theme.

## What's Included

### Dependencies
- `@mantine/core` - Core Mantine components
- `@mantine/hooks` - Useful React hooks
- `@mantine/notifications` - Toast notifications system
- `@tabler/icons-react` - Icon library for Mantine components
- `postcss-preset-mantine` - PostCSS configuration for Mantine
- `postcss-simple-vars` - CSS variables support

### Pre-configured Setup
- ✅ Mantine theme with professional blue color palette
- ✅ MantineProvider configured in `src/App.tsx`
- ✅ Notifications provider ready to use
- ✅ PostCSS configuration for Mantine styles
- ✅ Responsive breakpoints matching the theme
- ✅ Component defaults (radius, shadows, spacing)

## Quick Start

### Using Mantine Components

Import components from `@mantine/core`:

```tsx
import { Button, TextInput, Card, Title, Text, Stack } from '@mantine/core';

function MyComponent() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2}>Welcome</Title>
        <Text>Start building your UI with Mantine!</Text>
        <TextInput label="Email" placeholder="your@email.com" />
        <Button>Submit</Button>
      </Stack>
    </Card>
  );
}
```

### Using Icons

Import icons from `@tabler/icons-react`:

```tsx
import { IconCheck, IconUser, IconMail } from '@tabler/icons-react';
import { Button } from '@mantine/core';

function MyComponent() {
  return (
    <Button leftSection={<IconCheck size={16} />}>
      Save Changes
    </Button>
  );
}
```

### Using Notifications

```tsx
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

function showNotification() {
  notifications.show({
    title: 'Success!',
    message: 'Your changes have been saved',
    color: 'green',
    icon: <IconCheck size={16} />,
  });
}
```

## Theme Customization

### Current Theme

The template uses a professional blue theme defined in `src/theme/mantine-theme.ts`:

- **Primary Color**: Blue (#3B82F6)
- **Gray Scale**: Neutral grays for text and backgrounds
- **Dark Mode**: Dark color palette (ready to implement)

### Customizing Colors

To change the primary color, edit `src/theme/mantine-theme.ts`:

```typescript
export const theme = createTheme({
  primaryColor: 'blue', // Change to: 'green', 'red', 'violet', etc.
  colors: {
    blue: blueColors, // Your custom color palette
  },
});
```

### Creating Custom Color Palettes

Mantine requires 10 shades for each color (0-9):

```typescript
const customColors: MantineColorsTuple = [
  '#lightest', // 0
  '#lighter',  // 1
  '#light',    // 2
  '#...',      // 3
  '#...',      // 4
  '#main',     // 5 - Main brand color
  '#...',      // 6
  '#dark',     // 7
  '#darker',   // 8
  '#darkest',  // 9
];

export const theme = createTheme({
  colors: {
    custom: customColors,
  },
  primaryColor: 'custom',
});
```

**Tip**: Use tools like [Mantine Color Generator](https://mantine.dev/colors-generator/) to generate color palettes.

### Customizing Component Defaults

Edit component defaults in the theme:

```typescript
export const theme = createTheme({
  components: {
    Button: {
      defaultProps: {
        radius: 'lg',      // Change default radius
        size: 'md',        // Change default size
      },
    },
    Card: {
      defaultProps: {
        radius: 'xl',      // More rounded cards
        shadow: 'md',      // Deeper shadows
      },
    },
  },
});
```

### Customizing Spacing

```typescript
export const theme = createTheme({
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px - change these values
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
});
```

### Customizing Typography

```typescript
export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2' },
      h2: { fontSize: '2rem', lineHeight: '1.3' },
      // ... customize other heading sizes
    },
  },
});
```

## Common Patterns

### Layout Components

```tsx
import { Container, Stack, Group, Grid } from '@mantine/core';

// Vertical stacking
<Stack gap="md">
  <Component1 />
  <Component2 />
</Stack>

// Horizontal group
<Group justify="space-between">
  <Component1 />
  <Component2 />
</Group>

// Responsive grid
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
    <Component1 />
  </Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
    <Component2 />
  </Grid.Col>
</Grid>
```

### Form Components

```tsx
import { TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

function MyForm() {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Name"
          placeholder="John Doe"
          {...form.getInputProps('name')}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
```

### Cards and Papers

```tsx
import { Card, Paper, Title, Text, Stack } from '@mantine/core';

// Card with border
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Title order={3}>Card Title</Title>
  <Text>Card content goes here</Text>
</Card>

// Paper (simpler than Card)
<Paper p="md" shadow="xs" radius="md">
  <Text>Paper content</Text>
</Paper>
```

### Badges and Indicators

```tsx
import { Badge, Group } from '@mantine/core';

<Group>
  <Badge color="blue">New</Badge>
  <Badge color="green">Active</Badge>
  <Badge color="red">Error</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="light">Light</Badge>
</Group>
```

## Responsive Design

### Using Breakpoints

```tsx
import { Stack } from '@mantine/core';

// Responsive spacing
<Stack gap={{ base: 'xs', sm: 'md', lg: 'xl' }}>
  <Component />
</Stack>

// Responsive visibility
<Box visibleFrom="md">
  Only visible on medium screens and up
</Box>

<Box hiddenFrom="md">
  Hidden on medium screens and up
</Box>
```

### Media Queries

```tsx
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

function MyComponent() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <div>
      {isMobile ? 'Mobile view' : 'Desktop view'}
    </div>
  );
}
```

## Working with Both UI Systems

This template includes both Mantine UI and shadcn/ui. Here's how to use them together:

### When to Use Each

**Use Mantine for:**
- Form components (TextInput, Select, etc.)
- Layout components (Stack, Group, Grid)
- Notifications and modals
- Data display (Tables, Cards)
- Complex components (DatePicker, ColorPicker)

**Use shadcn/ui for:**
- Command palette
- Data tables with advanced features
- Specific components you prefer from shadcn

### Example: Hybrid Component

```tsx
import { Card, Title, Text, Stack } from '@mantine/core';
import { Button } from '@/components/ui/button'; // shadcn button

function HybridComponent() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Hybrid Component</Title>
        <Text>Using Mantine Card with shadcn Button</Text>
        <Button>shadcn Button</Button>
      </Stack>
    </Card>
  );
}
```

## Demo Page

Visit `/mantine-demo` to see all configured Mantine components in action with the current theme.

## Additional Resources

- [Mantine Documentation](https://mantine.dev/)
- [Mantine Components](https://mantine.dev/core/button/)
- [Mantine Hooks](https://mantine.dev/hooks/use-click-outside/)
- [Tabler Icons Gallery](https://tabler.io/icons)
- [Mantine Color Generator](https://mantine.dev/colors-generator/)
- [Mantine Theme Object](https://mantine.dev/theming/theme-object/)

## Troubleshooting

### Styles Not Applying

Make sure you've imported the Mantine CSS in `src/main.tsx`:

```tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
```

### TypeScript Errors

If you see TypeScript errors with theme types, make sure you're using the correct imports:

```tsx
import { MantineColorsTuple } from '@mantine/core';
```

### Build Errors

If PostCSS errors occur, verify `postcss.config.js` includes:

```javascript
export default {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Next Steps

1. Explore the demo page at `/mantine-demo`
2. Customize the theme colors in `src/theme/mantine-theme.ts`
3. Start building your UI with Mantine components
4. Refer to [Mantine documentation](https://mantine.dev/) for advanced usage

