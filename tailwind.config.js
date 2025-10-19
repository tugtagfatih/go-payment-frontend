/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Karanlık mod desteği için
  theme: {
    extend: {
      colors: {
        "primary": "#1d85ed",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "surface-light": "#ffffff",
            "surface-dark": "#1a2530",
            "text-light": "#111418",
            "text-dark": "#f6f7f8",
            "subtle-light": "#617589",
            "subtle-dark": "#a0b3c6",
            "success": "#22c55e",
            "danger": "#ef4444",
            "warning": "#f97316"
      },
      fontFamily: {
        "display": ["Manrope", 'sans-serif'] // Font ailesini tanımla
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Daha güzel form elementleri için
  ],
}