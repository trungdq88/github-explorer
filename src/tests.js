import 'babel-polyfill';

const context = require.context('.', true, /-test\.jsx?$/);
context.keys().forEach(context);
