import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'text-dark': '#2C3138',
        'text-gray': '#919BA8',
        'text-light': '#F7F9FC',
        'background-white': '#FFFFFF',
        'background-footer': '#2B313D',
        'border-light': 'rgba(0, 0, 0, 0.07)',
        'accent-red': '#FF0000',
        'accent-blue': '#0099FF',
        'accent-green': '#0C854A',
        'darkblue': '#0066CC',
      },
    },
  },
  plugins: [],
};

export default config;
