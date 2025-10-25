import { createTheme, MantineColorsTuple } from '@mantine/core';

/**
 * Primary Color Palette - Blue
 * Professional blue theme suitable for any application
 * Base: #3B82F6 (blue-500)
 */
const blueColors: MantineColorsTuple = [
  '#eff6ff', // 0 - lightest (blue-50)
  '#dbeafe', // 1 - (blue-100)
  '#bfdbfe', // 2 - (blue-200)
  '#93c5fd', // 3 - (blue-300)
  '#60a5fa', // 4 - (blue-400)
  '#3B82F6', // 5 - main brand color (blue-500)
  '#2563eb', // 6 - (blue-600)
  '#1d4ed8', // 7 - (blue-700)
  '#1e40af', // 8 - (blue-800)
  '#1e3a8a', // 9 - darkest (blue-900)
];

/**
 * Gray Scale - Neutral colors
 * For text, borders, and backgrounds
 */
const grayColors: MantineColorsTuple = [
  '#f9fafb', // 0 - lightest (gray-50)
  '#f3f4f6', // 1 - (gray-100)
  '#e5e7eb', // 2 - (gray-200)
  '#d1d5db', // 3 - (gray-300)
  '#9ca3af', // 4 - (gray-400)
  '#6b7280', // 5 - (gray-500)
  '#4b5563', // 6 - (gray-600)
  '#374151', // 7 - (gray-700)
  '#1f2937', // 8 - (gray-800)
  '#111827', // 9 - darkest (gray-900)
];

/**
 * Dark Mode Color Palette
 * For potential dark mode support
 */
const darkColors: MantineColorsTuple = [
  '#C1C2C5', // 0 - lightest
  '#A6A7AB', // 1
  '#909296', // 2
  '#5c5f66', // 3
  '#373A40', // 4
  '#2C2E33', // 5
  '#25262b', // 6
  '#1A1B1E', // 7
  '#141517', // 8
  '#101113', // 9 - darkest
];

/**
 * App Template Mantine Theme
 * 
 * A clean, professional blue theme that's easy to customize.
 * This theme is designed to be a starting point for any application.
 * 
 * To customize:
 * 1. Change primaryColor to 'blue' or any other color
 * 2. Modify the color palettes above to match your brand
 * 3. Adjust spacing, shadows, and component defaults as needed
 * 
 * @see docs/mantine-setup.md for detailed customization guide
 */
export const theme = createTheme({
  /** Primary color used throughout the app */
  primaryColor: 'blue',

  /** Custom color palettes */
  colors: {
    blue: blueColors,
    gray: grayColors,
    dark: darkColors,
  },

  /** Font family for body text */
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  /** Font family for headings */
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2rem', lineHeight: '1.2' },
      h2: { fontSize: '1.5rem', lineHeight: '1.3' },
      h3: { fontSize: '1.25rem', lineHeight: '1.4' },
      h4: { fontSize: '1.125rem', lineHeight: '1.5' },
      h5: { fontSize: '1rem', lineHeight: '1.5' },
      h6: { fontSize: '0.875rem', lineHeight: '1.5' },
    },
  },

  /** Default border radius */
  defaultRadius: 'md',

  /** Spacing scale */
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },

  /** Breakpoints for responsive design */
  breakpoints: {
    xs: '36em',  // 576px
    sm: '48em',  // 768px
    md: '62em',  // 992px
    lg: '75em',  // 1200px
    xl: '88em',  // 1408px
  },

  /** Shadow presets */
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
    md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
    lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px',
    xl: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px',
  },

  /** Component-specific overrides */
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
      },
    },
  },
});

