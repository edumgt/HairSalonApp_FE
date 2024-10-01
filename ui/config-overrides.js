const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@public': path.resolve(__dirname, 'public'),
    '@ui': path.resolve(__dirname, 'src'),
  };

  return config;
};