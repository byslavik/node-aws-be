import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import 'source-map-support/register';
import { createProducts } from './addProduct';
import { getDBClient } from '../db';

export const handler = async (event: SQSEvent) => {
  console.log('Running catalogBatchProcess lambda');
  const products = event.Records.map(({ body }) => JSON.parse(body));
  const sns = new SNS();

  if (!products.length) {
    console.log('No items to add. Exiting...')
  }
  try {
    const client = await getDBClient();

    console.log('Got products to add to DB', products);
    await createProducts(products, client);

    console.log('catalogBatchProcess has been successfully added products');
  } catch (err) {
    console.log('catalogBatchProcess has been failed', err);
  }

  await sns.publish({
      Subject: 'New products have been added',
      Message: `Name of products:\n${products.map(({ title }) => title).join('\n')}`,
      TopicArn: process.env.SNS_ARN
  }).promise();

  console.log('Email sent!')
}
