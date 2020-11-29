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
      PG_DATABASE: 'postgres',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 'pass',
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ]
  },
  resources:{
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'product-service-sqs-queue'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'product-service-sns-topic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'rsapp.sns.sqs.test.email@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    },
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'SQSQueue'
        },
        Export: {
          Name: 'SQSQueueUrl'
        }
      },
      SQSQueueARN: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'SQSQueueARN'
        }
      }
    }
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
            cors: true
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
    },
    catalogBatchProcess: {
      handler: 'handlers/catalogBatchProcess.handler',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn']
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
