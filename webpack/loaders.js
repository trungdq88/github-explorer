const pkg = require('../package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.NODE_ENV || 'production';

const urlLoaderPrefix = 'url-loader?name=assets/[name].[ext]&limit=100000';
const fileLoader = 'file-loader?name=assets/[name].[ext]';
let cssLoader;
let jsxLoader;
const htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  `template-html-loader?${[
    'raw=true',
    'engine=lodash',
    `version=${pkg.version}`,
    `title=${pkg.name}`,
    `environment=${ENV}`,
  ].join('&')}`,
].join('!');

if (ENV === 'development' || ENV === 'test') {
  jsxLoader = [];
  if (ENV !== 'test') {
    jsxLoader.push('react-hot');
  }
  jsxLoader.push('babel');
  cssLoader = [
    'style-loader',
    'css-loader?sourceMap&localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader',
  ].join('!');
} else {
  jsxLoader = ['babel'];
  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?localIdentName=[hash:base64:5]',
    'postcss-loader',
  ].join('!'));
}

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsxLoader, /* 'babel' */
  },
  { test: /\.css$/, loader: cssLoader /* "style-loader!css-loader" */ },
  { test: /\.png$/, loader: 'url-loader?limit=100000' },
  {
    test: /\.html$/,
    loader: htmlLoader,
  },
  {
    test: /(\.jpe?g|\.gif|\.png|\.ico|\.svg)/,
    loader: fileLoader,
  },
  {
    test: /(\.eot|\.woff2|\.woff|\.ttf|\.otf)/,
    loader: ENV === 'development' ? urlLoaderPrefix : fileLoader,
  },
  {
    test: /\.less$/,
    loader: 'style!css!less',
  },
  {
    test: /\.json$/,
    loader: 'json',
  },
];
module.exports = loaders;
