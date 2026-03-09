/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette premium (70% blanc/beige, 20% nude, 10% gold/green accents)
        primary: '#F5EFEA',       // Beige chaud — fonds principaux
        secondary: '#E8DAD1',    // Nude rosé — sections secondaires
        'accent-gold': '#C6A75E', // Or — accents (boutons, liens)
        'dark-brown': '#3A2F2A',  // Texte principal
        'soft-green': '#8FAE9E',  // Vert doux — accents nature
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
