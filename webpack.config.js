const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    module: true,
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: ['node_modules'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      crypto: false,
      fs: false
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets/' },
        { from: 'src/index.html', to: 'index.html' },      
        { from: 'src/style.css', to: 'style.css' },        
        { from: 'src/toggle-square.js', to: 'toggle-square.js' }, 
        { from: 'src/toggle-rolling-reverse.js', to: 'toggle-rolling-reverse.js' },
        { from: 'src/toggle-rolling.js', to: 'toggle-rolling.js' },
        { from: 'src/toggle-switch.js', to: 'toggle-switch.js' },
        { from: 'src/volumeslider.js', to: 'volumeslider.js' },
        { from: 'src/circular-gauge.js', to: 'circular-gauge.js' },
        { from: 'src/radio-toggle.js', to: 'radio-toggle.js' },
        { from: 'src/radio-toggle-vert.js', to: 'radio-toggle-vert.js' },
        { from: 'src/circular-preloader.js', to: 'circular-preloader.js' },
        { from: 'src/rolling-menu.js', to: 'rolling-menu.js' },
        { from: 'src/shutdown-progress.js', to: 'shutdown-progress.js' },
        { from: 'src/analog-clock.js', to: 'analog-clock.js' },
        { from: 'src/glass-carousel.js', to: 'glass-carousel.js' },
        { from: 'src/flip-card.js', to: 'flip-card.js' },
        { from: 'src/button-oval.js', to: 'button-oval.js' },
        { from: 'src/button-mute.js', to: 'button-mute.js' },
        { from: 'src/button-rectangle.js', to: 'button-rectangle.js' },
        { from: 'src/button-nav.js', to: 'button-nav.js' },
        { from: 'src/toggle-hole.js', to: 'toggle-hole.js' },
      ]      
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: false,
    liveReload: true
  }
};