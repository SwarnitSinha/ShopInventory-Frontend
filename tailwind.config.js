/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(214, 32%, 91%)", // Light grayish border color
        background: "hsl(210, 40%, 98%)",
        foreground: "hsl(222, 47%, 11%)",
      },
    },
  },
  plugins: [],
};
