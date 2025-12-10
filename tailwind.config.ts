import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-kr)', 'sans-serif'],
      },
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
        // 토스 스타일 컬러 시스템 (파트너/관리자) - CSS 변수 사용으로 다크모드 자동 지원
        'bg-primary': 'var(--bg-primary)',
        'bg-card': 'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'action-primary': 'var(--action-primary)',
        'action-primary-hover': 'var(--action-primary-hover)',
        'status-new': 'var(--status-new)',
        'status-progress': 'var(--status-progress)',
        'status-done': 'var(--status-done)',
        'status-cancelled': 'var(--status-cancelled)',
        'error': 'var(--error)',
        'overlay': 'var(--overlay)',
        'border': 'var(--border)',
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
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
