/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0A0A0A", // Main background (almost black)
                secondary: "#1A1A1A", // Card background
                tertiary: "#2A2A2A", // Borders / Inputs
                accent: "#FCD34D", // Amber-300/Yellow - Bright text
                brand: {
                    yellow: "#FFD700", // Main Brand Yellow (Buttons)
                    dark: "#111111",
                    gray: "#9CA3AF"
                }
            }
        },
    },
    plugins: [],
}
