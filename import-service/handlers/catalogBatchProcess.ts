import { APIGatewayProxyHandler, SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import 'source-map-support/register';

export const handler = async (event: SQSEvent) => {
  console.log('Running catalogBatchProcess lambda');
  const products = event.Records.map(({ body }) => JSON.parse(body));
  const sns = new SNS();

  console.log('Got products to add to DB', products);

  sns.publish({
      Subject: 'New products have been added',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN
  }, (err, data) => {
    if (err) {
      console.error(`Message sendin failed! Details: ${err}`);
    } else {
      console.log('The message with the following data was sent: ', data);
    }
  })
}
