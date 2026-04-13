/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        surface: '#1a1a1a',
        card: '#222222',
        'card-elevated': '#2a2a2a',
        border: '#333333',
        primary: '#c8102e',
        'primary-hover': '#a50d26',
        gold: '#e0a020',
        'gold-light': '#f0b830',
        'text-primary': '#ffffff',
        'text-secondary': '#aaaaaa',
        'text-muted': '#666666',
        success: '#22c55e',
        danger: '#ef4444',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
        pill: '999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
