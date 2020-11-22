import { Serverless } from 'serverless/aws';

const BUCKET_NAME = 'aws-nodejs-product-service-storage';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      BUCKET_NAME,
      SQS_URL: {
        Ref: 'SQSQueue'
      },
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
      },
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
          QueueName: 'import-service-sqs-queue'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'import-service-sns-topic'
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
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handlers/importProductsFile.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters:{
                querystrings:{
                  name: true
                }
              }
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handlers/importFileParser.handler',
      events: [
        {
          s3: {
            bucket: BUCKET_NAME,
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '.csv',
              },
            ],
            existing: true,
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
