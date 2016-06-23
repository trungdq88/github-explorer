const webpackConfig = require('./webpack/config.test');
module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['source-map-support', 'mocha', 'sinon'],
    files: [
      'src/tests.js',
    ],
    exclude: [],
    preprocessors: {
      'src/tests.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha', 'coverage', 'coveralls'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [/* 'Chrome', */'PhantomJS'],
    singleRun: false,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-coveralls',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-sinon',
      'karma-source-map-support',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/',
    },
  });
};
