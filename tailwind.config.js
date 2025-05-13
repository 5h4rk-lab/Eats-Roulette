export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ketchup: '#e53935',
        mustard: '#fdd835',
        lettuce: '#7cb342',
        bun: '#f5deb3',
      },
      fontFamily: {
        header: ['"Comic Neue"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      keyframes: {
        spinPlate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        spinPlate: 'spinPlate 1s linear infinite',
      },
      backgroundImage: {
        foodPattern: "url('https://www.transparenttextures.com/patterns/burger-paper.png')",
      },
    },
  },
  plugins: [],
};