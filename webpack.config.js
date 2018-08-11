'use strict'
const path = require('path');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const webpack = require('webpack');

const testHTML = path.resolve(__dirname, 'submodules', 'index.html');

module.exports = {
  devtool: '',
  profile: true,

  entry: {
    'shared/polyfills': [
      './submodules/app1/polyfills.ts',
      './submodules/app2/polyfills.ts',
      './submodules/app3/polyfills.ts'
    ],
    'app1/firstapp': ['./submodules/app1/index.ts'],
    'app2/secondapp': ['./submodules/app2/index.ts'],
    'app3/thirdapp': ['./submodules/app3/index.ts']
  },

  output: {
    path: path.join(__dirname, 'dist', 'dev'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'build-cache')
    ]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          'css-loader'
        ]
      },
    ]
  },

  plugins: [
    new StatsPlugin('stats.json', 'verbose'),

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared/polyfills',
      chunks: ['shared/polyfills']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared/vendors',
      chunks: [
        'app1/firstapp',
        'app2/secondapp',
        'app3/thirdapp'
      ],
      // Move all node_modules into vendors chunk but not @angular
      minChunks: module => /node_modules\/(?!@angular)/.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared/angular-vendors',
      chunks: [
        'app1/firstapp',
        'app2/secondapp',
        'app3/thirdapp'
      ],
      // Move all node_modules into vendors chunk but not @angular
      minChunks: module => /node_modules\/@angular/.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared/shared-modules',
      chunks: [
        'app1/firstapp',
        'app2/secondapp',
        'app3/thirdapp'
      ],
      // Move duplicate modules to a shared-modules chunk
      minChunks: 2
    }),
    // Specify the correct order the scripts will be injected in
    new webpack.optimize.CommonsChunkPlugin({
      name: [
        'shared/polyfills',
        'shared/vendors',
        'shared/angular-vendors'
      ].reverse()
    }),

    new HtmlWebpackPlugin({
      template: testHTML,
      inject: false
    })
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },
  target: 'web'
}
