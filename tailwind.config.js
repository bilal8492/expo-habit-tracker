

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}"
    ]
  },
  presets: [require("nativewind/preset")],
  plugins: [],
  important: 'html',
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        secondary: '#6B7280',
        background: '#F3F4F6',
        surface: '#FFFFFF',
      },
    },
  },
};