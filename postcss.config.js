const path = require('path');
const context = path.resolve(__dirname, 'frontend');

module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-import')({
      path: context
    }),
    require('postcss-clearfix'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
  ]
};
