var path = require("path")
  , webpack = require("webpack");
  , loadersByExtension = require("./config/loadersByExtension")

module.exports = function(options) {
  var entry
    , loaders
    , plugins
    , root
    , extensions
    , publicPath
    , output
    , longTermCaching
    , excludeFromStats
    , modulesDirectories;

  entry = {
    main: '../client.js'
  };

  loaders = {
    'jsx': options.hotComponents ? ['react-hot-loader', 'jsx-loader?harmony'] : 'jsx-loader?harmony'
    'css': 'css-loader'
  , 'scss|sass': 'css-loader!sass-loader'
  , 'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000'
  , 'woff|woff2': 'url-loader?limit=100000'
  , 'ttf|eot': 'file-loader'
  };

  modulesDirectories = ['node_modules'];
  extensions = ['', '.web.js', '.js', '.jsx'];
  root = path.join(__dirname, 'app');
  publicPath = options.devServer ? 'http://localhost:2992/_assets/' : '/_assets/';

  longTermCaching = options.longTermCaching ? '?[chunkhash]' : '';
  output = {
    path: path.join(__dirname, 'build', 'public')
  , publicPath: publicPath
  , filename: '[name].js' + longTermCaching
  , chunkFilename: (options.devServer ? '[id].js' : '[name].js') + longTermCaching
  , sourceMapFilename: 'debugging/[file].map'
  , pathinfo: options.debug
  };

  excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/
  ];

  plugins = [
    new webpack.PrefetchPlugin("react")
  , new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
  ];

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin()
    , new webpack.optimize.DedupePlugin()
    , new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    , new webpack.NoErrorsPlugin()
    );
  }

  return {
    entry: entry
  , output: output
  , target: 'web'
  , module: {
      loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders))
    }
  , devtool: options.devtool
  , debug: options.debug
  , resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    }
  , resolve: {
      root: root
    , modulesDirectories: modulesDirectories,
    , extensions: extensions
    }
  , plugins: plugins
  , devServer: {
      stats: {
        cached: false
      , exclude: excludeFromStats
      }
    }
  };
};
