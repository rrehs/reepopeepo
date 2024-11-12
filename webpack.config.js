const path = require('path');

module.exports = {
  entry: 'index.html',  // Make sure you have an entry file here
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',  // Or 'production' depending on your environment
};
