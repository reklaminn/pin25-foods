import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Dark mode'u class tabanlı yapıyoruz
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mealora: {
          primary: '#1E6B3A',   // P25 Green
          secondary: '#3E5834', // Deep Olive
          cream: '#F7F3EA',     // Cream Background
          accent: '#EB6F75',    // Warm Pink
          yellow: '#F2B829',    // Golden Yellow
          teal: '#2E6E6C',      // Muted Teal
          graphite: '#2B2B2B',  // Graphite
        },
        // Dark mode için özel gri tonları
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          border: '#2E2E2E'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        logo: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
