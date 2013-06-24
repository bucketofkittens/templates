var geddy, config;
geddy = require('geddy');
config = require('./config/development');
geddy.startCluster({
  // Configuration here
  environment: 'development'
});