import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'auth-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    profile: 'mentoring',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  resources: {
    Resources: {},
    Outputs: {
      AuthARN: {
        Value: {
          'Fn::GetAtt': ['BasicAuthLambdaFunction', 'Arn']
        },
        Export: {
          Name: 'AuthARN',
        }
      }
    }
  },
  functions: {
    basicAuth: {
      name: 'BasicAuthLambdaFunction',
      handler: 'handlers/basicAuth.handler',
    }
  }
}

module.exports = serverlessConfiguration;