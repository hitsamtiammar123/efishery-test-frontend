const path = require('path');

module.exports = {
  webpack: {
    alias: {
      Assets:  path.resolve(__dirname, 'src/assets'),
      ComponentMain: path.resolve(__dirname, 'src/components/main')
    }
  }
}