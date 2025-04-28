/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js,svelte,ts}'
    ],
    plugins: [
        require('@tailwindcss/typography'),
        require('tailwind-hamburgers')
    ],
    darkMode: 'class'
};
