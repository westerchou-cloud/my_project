/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', secondary: '#475569', success: '#10b981', danger: '#ef4444', warning: '#f59e0b', sidebar: '#1e293b',
            }
        },
    },
    plugins: [],
}
