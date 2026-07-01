/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'ui-sans-serif', 'system-ui'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#064E3B',
          hover: '#047857',
          deep: '#022C22',
        },
        accent: {
          DEFAULT: '#D97706',
          hover: '#B45309',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FAFAFA',
          hover: '#F3F4F6',
        },
      },
      borderRadius: {
        sm: '2px',
      },
    },
  },
  plugins: [],
};
