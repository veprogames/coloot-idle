/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["PressStart2P", "sans-serif"]
      }
    },
  },
  plugins: [],
}

