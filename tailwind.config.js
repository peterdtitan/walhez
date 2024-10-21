/** @type {import('tailwindcss').Config} */
import {nextui} from "@nextui-org/react";


const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1E2D44",
        foreground: "var(--foreground)",
        primaryRed: "#bc1c21",
        primaryYellow: "#F2C94C",
        primaryGrey: "#F4F4F4",
      },
      fontFamily: {
        montserrat: ['montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/constructionBg.jpg')",
      }
    },
  },
  plugins: [nextui()],
  darkMode: "class",
}

export default config;