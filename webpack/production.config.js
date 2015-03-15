module.exports = [
  require('./make-config')({
  , longTermCaching: true
  , minimize: true
  // , devtool: 'source-map'
  })
];
