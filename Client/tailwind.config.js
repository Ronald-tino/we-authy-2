/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background Colors
        "bg-primary": "#020202",
        "bg-secondary": "#0d2818",
        "bg-tertiary": "#0d2818",
        "bg-card": "#0d2818",
        "bg-hover": "#04471c",

        // Green Accent Colors
        "green-darkest": "#0d2818",
        "green-dark": "#04471c",
        "green-medium": "#058c42",
        "green-bright": "#16db65",
        "green-light": "#16db65",

        // Text Colors
        "text-primary": "#ffffff",
        "text-secondary": "rgba(255, 255, 255, 0.6)",
        "text-tertiary": "rgba(255, 255, 255, 0.4)",
        "text-muted": "rgba(255, 255, 255, 0.3)",

        // Border Colors
        "border-primary": "rgba(255, 255, 255, 0.12)",
        "border-secondary": "#04471c",
        "border-accent": "#058c42",

        // Status Colors
        success: "#16db65",
        warning: "#ff8c42",
        error: "#ff4444",
        info: "#058c42",
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "gradient-y": {
          "0%, 100%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            transform: "translateX(-50%)",
          },
          "50%": {
            transform: "translateX(50%)",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            transform: "translate(-50%, -50%)",
          },
          "25%": {
            transform: "translate(50%, -50%)",
          },
          "50%": {
            transform: "translate(50%, 50%)",
          },
          "75%": {
            transform: "translate(-50%, 50%)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 20px rgba(22, 219, 101, 0.3)",
          },
          "100%": {
            boxShadow: "0 0 30px rgba(22, 219, 101, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
};
