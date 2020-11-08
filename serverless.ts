import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    profile: 'mentoring',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'host',
      PG_PORT: 5432,
      PG_DATABASE: 'dbname',
      PG_USERNAME: 'dbuser',
      PG_PASSWORD: 'dbpass'
    },
  },
  functions: {
    getProductsList: {
      handler: 'handlers/getProductsList.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
          }
        }
      ]
    },
    addProduct: {
      handler: 'handlers/addProduct.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
          }
        }
      ]
    },
    getProductById: {
      handler: 'handlers/getProductById.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
