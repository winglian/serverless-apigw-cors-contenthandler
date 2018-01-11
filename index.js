'use strict';
const _ = require('lodash');

class CorsContentHandler {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.provider = this.serverless.getProvider('aws');

    this.commands = {
      deploy: {
        lifecycleEvents: [
          'resources',
        ]
      },
    };

    this.hooks = {
      'package:compileEvents': this.main.bind(this),
    };
  }

  main() {
    _.forEach(this.serverless.service.provider.compiledCloudFormationTemplate.Resources, resource => {
      if (resource.Type === 'AWS::ApiGateway::Method' && resource.Properties.HttpMethod === 'OPTIONS') {
        resource.Properties.Integration.ContentHandling = 'CONVERT_TO_TEXT';
      }
    });
  }
}

module.exports = CorsContentHandler;