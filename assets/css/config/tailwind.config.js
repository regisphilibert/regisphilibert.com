module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: require('./purge.config.js'),
  theme: {
    extend: {
      colors: require('./colors.config.js'),
      spacing: {
        '4m': '1em'
      }
    }
  },
  variants: {
    // https://tailwindcss.com/docs/configuring-variants
    display: ['responsive', 'group-hover', 'hover']
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ]
};
