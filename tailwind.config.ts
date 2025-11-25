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
        // 랜딩 페이지용 색상
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
        // 토스 스타일 컬러 시스템 (파트너/관리자)
        'bg-primary': '#F7F8FA',
        'bg-card': '#FFFFFF',
        'text-primary': '#191F28',
        'text-secondary': '#8B95A1',
        'text-tertiary': '#B0B8C1',
        'action-primary': '#3182F6',
        'action-primary-hover': '#1B64DA',
        'status-new': '#3182F6',
        'status-progress': '#FF9500',
        'status-done': '#34C759',
        'status-cancelled': '#8B95A1',
        'error': '#F04452',
        'overlay': 'rgba(0, 0, 0, 0.5)',
        'border': '#E5E8EB',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
      },
      fontSize: {
        'heading': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'title': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '18px', fontWeight: '400' }],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
