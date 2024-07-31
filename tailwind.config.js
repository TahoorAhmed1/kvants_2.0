/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderImage: {
        gradient: "linear-gradient(90deg, #FF9463 0%, #A51CF5 96.4%)",
      },
      colors: {
        gradAlt: "rgba(255, 148, 99, 1)",
        offwhite: "rgba(249, 249, 249, 1)",
      },
      fontFamily: {
        // sans: "Open Sans",
        // krona: "Krona One",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".border-gradient": {
          borderImage: "var(--tw-border-image)",
        },
      });
    },
  ],
};
