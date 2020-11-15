import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const s3 = new AWS.S3({
      region: 'eu-west-1'
    });
    const params = {
      Bucket: 'aws-nodejs-product-service-storage',
      Prefix: 'uploaded/'
    }
  } catch (err) {
    console.log(err)
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}
