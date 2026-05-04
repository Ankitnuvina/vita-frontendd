/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#F0F7F2',
          100: '#D6EDE0',
          200: '#AEDABC',
          300: '#8EC9A2',
          400: '#5FA876',
          500: '#3D8F5A',
          600: '#2D7045',
        },
        tan: {
          50: '#FDF3EE',
          100: '#F5D9C5',
          400: '#C47845',
          600: '#9B5425',
        },
        blue: { 400: '#4A8DB8' },
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
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
