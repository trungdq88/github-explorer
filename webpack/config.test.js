const config = require('./config');

delete config.context;
delete config.entry;
delete config.output;
delete config.devServer;

config.module.postLoaders = [
  { // delays coverage til after tests are run, fixing transpiled source coverage error
    test: /\.jsx?$/,
    exclude: /(test|node_modules|bower_components)\//,
    loader: 'istanbul-instrumenter',
  },
];

module.exports = config;
