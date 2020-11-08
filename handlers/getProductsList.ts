import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getResponse } from '../helpers';
import { getDBClient } from '../db';

export const handler = async (_event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda getProductsList invocation with:', _event)
    const client = await getDBClient();
    const { rows: productList } = await client.query(`
      select * from products p
        JOIN stocks s ON p.id=s.product_id
        JOIN brands b ON p.brand_id=b.id
        JOIN categories c ON p.category_id=c.id
    `);

    console.log('Lambda getProductsList execution successfully finished', productList)
    return getResponse(200, productList)
  } catch (err) {
    console.log('Lambda getProductsList execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
