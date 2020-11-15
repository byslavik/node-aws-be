import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { getResponse } from '../../helpers';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Running importProductFile lambda');
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });
  const params = {
    Bucket: 'aws-nodejs-product-service-storage',
    Key: 'uploaded/' + event.queryStringParameters.name
  }
  try {
    console.log('Trying to get object from s3', params);
    const s3Res = await s3.headObject(params).promise();
    console.log('Got response from s3', s3Res);
    console.log('Retrieving of signed url', s3Res);
    const signedUrl = s3.getSignedUrl('getObject', params);
    console.log('Got signed url', signedUrl);
  
    return getResponse(200, { signedUrl })
  } catch ({ statusCode, message }) {
    console.error({ statusCode, message })
    return getResponse(statusCode, { message })
  }
}
