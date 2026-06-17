/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
      },
    },

    extend: {
      colors: {
        green: {
          50:  '#F0F7F2',
          100: '#D6EDE0',
          200: '#AEDABC',
          300: '#8EC9A2',
          400: '#5FA876',
          500: '#3D8F5A',
          600: '#2D7045',
          700: '#1F5331',
          800: '#143820',
        },
        tan: {
          50:  '#FDF3EE',
          100: '#F5D9C5',
          200: '#EDBE9E',
          400: '#C47845',
          500: '#B26535',
          600: '#9B5425',
        },
        blue: { 400: '#4A8DB8', 500: '#2F73A0' },
        ink: {
          DEFAULT: '#131917',
          2: '#2D3830',
          3: '#5A6B62',
          4: '#8A9E93',
        },
        paper: '#FAFAF8',
        border: { DEFAULT: '#E4EDE7', 2: '#C8D9CE' },
      },

      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      borderRadius: {
        '4xl': '2rem',
      },

      boxShadow: {
        'soft':   '0 1px 4px rgba(19, 25, 23, 0.06)',
        'card':   '0 4px 16px rgba(19, 25, 23, 0.08)',
        'lifted': '0 10px 32px rgba(19, 25, 23, 0.10)',
        'pop':    '0 20px 56px rgba(19, 25, 23, 0.14)',
        'glow':   '0 12px 36px rgba(61, 143, 90, 0.25)',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      keyframes: {
        'fade-in':   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-up':   { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'zoom-in':   { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'slide-down':{ '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'shimmer':   { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },

      animation: {
        'fade-in':    'fade-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up':    'fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'zoom-in':    'zoom-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-down': 'slide-down 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'shimmer':    'shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
