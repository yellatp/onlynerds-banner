/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        tan: '#C79A6F',
        bg: '#07090C',
        surface: '#0D1117',
        surface2: '#121820',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
