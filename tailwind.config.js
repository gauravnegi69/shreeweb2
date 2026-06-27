/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#070A13',
          800: '#0B0F19',
          700: '#151C2C',
          600: '#1F293D',
        },
        neon: {
          teal: '#00F2FE',
          blue: '#4FACFE',
          purple: '#8B5CF6',
          rose: '#F43F5E',
          gold: '#F59E0B',
        }
      },
      backgroundImage: {
        'glass-glow': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 60%)',
        'teal-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.15), transparent 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
