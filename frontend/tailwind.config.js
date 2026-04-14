/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5', // Soft Indigo 600
                secondary: '#94a3b8', // Muted Blue / Slate 400
                accent: '#8b5cf6', // Soft Purple / Violet 500
                background: '#f8fafc',
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'nexora-gradient': 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
            }
        },
    },
    plugins: [],
}
