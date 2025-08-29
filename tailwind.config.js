/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        secondary: '#8b5cf6',
        accent: '#ec4899',
        dark: {
          DEFAULT: '#212121',
          darker: '#171717',
          card: '#2a2a2a',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 0.0625rem 0.125rem 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 0.1)',
        'md': '0 0.625rem 0.9375rem -0.1875rem rgb(0 0 0 / 0.1)',
        'lg': '0 1.25rem 1.5625rem -0.3125rem rgb(0 0 0 / 0.1)',
        'xl': '0 1.5625rem 3.125rem -0.75rem rgb(0 0 0 / 0.7)',
      },
      screens: {
        'xs': '29.6875rem',
        'sm': '40rem',
        'md': '48rem', 
        'lg': '64rem',
        'xl': '80rem',
        '2xl': '96rem',
      }
    },
  },
  plugins: [
    // Note: In ES module format, you'd typically import this differently
    // For now, removing the plugin to resolve build issues
    // import typography from '@tailwindcss/typography'
  ],
}