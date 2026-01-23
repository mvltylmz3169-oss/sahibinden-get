/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        product: ["LucidaGrande", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blurIn: {
          '0%': { 
            '--tw-backdrop-blur': 'blur(0)',
            opacity: '0'
          },
          '100%': { 
            '--tw-backdrop-blur': 'blur(8px)',
            opacity: '1'
          },
        },
        modalIn: {
          '0%': { 
            transform: 'scale(0.95) translateY(20px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'scale(1) translateY(0)', 
            opacity: '1' 
          },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        blurIn: 'blurIn 0.5s ease-out forwards',
        modalIn: 'modalIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
