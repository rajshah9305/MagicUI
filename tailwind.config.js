/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'token-bg': 'var(--color-bg)',
        'token-surface': 'var(--color-surface)',
        'token-primary': 'var(--color-primary)',
        'token-accent': 'var(--color-accent)',
        'token-text': 'var(--color-text)',
        'token-muted': 'var(--color-muted)',
        'token-success': 'var(--color-success)',
        'token-error': 'var(--color-error)',
        'token-warning': 'var(--color-warning)',
      },
      fontFamily: {
        'heading': ['var(--font-heading)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'aurora': 'aurora 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'neural-pulse': 'neural-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' },
          '25%': { transform: 'translateX(-40%) translateY(-60%) rotate(90deg)' },
          '50%': { transform: 'translateX(-60%) translateY(-40%) rotate(180deg)' },
          '75%': { transform: 'translateX(-40%) translateY(-60%) rotate(270deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px var(--color-primary)' },
          '100%': { boxShadow: '0 0 40px var(--color-primary), 0 0 60px var(--color-primary)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neural': '0 0 20px rgba(0, 240, 255, 0.3)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}