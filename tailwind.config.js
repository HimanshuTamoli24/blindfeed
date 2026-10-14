/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vercel: {
          dark: '#000000',
          card: '#0a0a0a',
          cardHover: '#121212',
          border: '#222222',
          borderLight: '#2e2e2e',
          textMuted: '#888888',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
