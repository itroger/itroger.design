module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6869ac',
        fa: '#fafafa',
        111: '#111111',
        666: '#666666'
      },
      fontFamily: {
        georgia: ['Georgia', 'sans']
      },
      backdropBlur: {
        5: '5px'
      },
      backdropSaturate: {
        180: '180%'
      },
      boxSizing: {
        inherit: 'inherit'
      }
    }
  },
  plugins: []
}
