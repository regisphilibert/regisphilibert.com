module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: require('./purge.config.js'),
  theme: {
    extend: {
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
