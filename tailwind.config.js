/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00D4FF',
          pink: '#FF2E97',
          green: '#39FF14',
          purple: '#B026FF',
          yellow: '#FFE600',
          orange: '#FF6B35',
        },
        batik: {
          50: '#FFF8F0',
          100: '#FFE8D1',
          200: '#FFD0A3',
          300: '#FFB366',
          400: '#FF8C33',
          500: '#E67300',
          600: '#B35900',
          700: '#804000',
          800: '#4D2600',
          900: '#1A0D00',
        },
        ink: {
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#C0C0C0',
          300: '#9E9E9E',
          400: '#757575',
          500: '#545454',
          600: '#404040',
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
