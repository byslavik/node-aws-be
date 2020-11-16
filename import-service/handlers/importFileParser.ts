import { S3Event } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';
import * as csv from 'csv-parser';

export const handler = (event: S3Event, _context) => {
  console.log('Running importFileParser', event);
  const { BUCKET_NAME } = process.env;
  try {
    const s3 = new S3({ region: 'eu-west-1' });

    event.Records.forEach((record) => {
      console.log('Record object: ', record.s3.object);
      const s3ReadStream = s3.getObject({
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key,
      }).createReadStream();

      s3ReadStream
        .pipe(csv())
        .on('data', (chunk) => { console.log('parsed chunk: ', chunk) })
        .on('end', async () => {
          const from = `${BUCKET_NAME}/${record.s3.object.key}`;
          const to = record.s3.object.key.replace('uploaded', 'parsed');

          await s3.copyObject({
            Bucket: BUCKET_NAME,
            CopySource: from,
            Key: to,
          }).promise();
          console.log(`copied from ${from} to ${to}`);

          await s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: record.s3.object.key,
          }).promise();
          console.log(`deleted from ${from}`);
        });
    });

  } catch (error) {
    console.log('Error: ', error);
  }
}