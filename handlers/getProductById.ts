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
      select * from products p
        JOIN stocks s ON p.id=s.product_id
        JOIN brands b ON p.brand_id=b.id
        JOIN categories c ON p.category_id=c.id
        where p.id='${productId}'
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
