import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getResponse } from '../helpers';
import { getDBClient } from '../db';

export const handler = async (event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda getProductById invocation with:', event)
    const { pathParameters: { productId } } = event;
    const client = await getDBClient();
    const { rows: [product] = [] } = await client.query(`
      select p.*, s.count from products p
        LEFT JOIN stocks s ON p.id=s.product_id
        WHERE p.id='${productId}'
    `);
    const status = product ? 200 : 404;
    const body = product || { message: 'Item not found' };
    console.log('Lambda getProductById execution successfully finished', body)
    return getResponse(status, body)
  } catch (err) {

    console.log('Lambda getProductById execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
