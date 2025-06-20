module.exports = {
  darkMode: 'class',
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
        text: '#f5f5f5',
        primary: '#4f46e5',
        secondary: '#3b82f6',
      },
    },
  },
  plugins: [],
};