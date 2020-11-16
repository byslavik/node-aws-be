import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { getResponse } from '../../helpers';
import 'source-map-support/register';
import { checkRequestedFile } from '../helpers';
import { ALLOWED_EXTENSIONS } from '../constants';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Running importProductFile lambda');

  const { queryStringParameters: { name: fileName } } = event
  if (!checkRequestedFile(fileName)) {
    console.log('Unsupported file type', fileName);

    return getResponse(400, { message: `Unsupported file format. Service supports only ${ALLOWED_EXTENSIONS.join(', ')}` })
  }
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${fileName}`,
    ContentType: "text/csv",
    Expires: 60,
  }

  try {
    console.log('Trying to get signed url from s3', params);

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    console.log('Got signed url', signedUrl);

    return getResponse(200, { signedUrl })
  } catch (err) {
    console.error(err);

    return getResponse(500, { message: err.message });
  }
}
