const path = require('path');

module.exports = {
  webpack: {
    alias: {
      Assets:  path.resolve(__dirname, 'src/assets'),
      ComponentMain: path.resolve(__dirname, 'src/components/main'),
      ComponentNavigation: path.resolve(__dirname, 'src/components/navigation'),
      Pages: path.resolve(__dirname, 'src/pages')
    }
  }
}
