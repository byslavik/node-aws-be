import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getResponse } from '../helpers';
import { getDBClient } from '../db';

export const handler = async (_event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda getProductsList invocation with:', _event)
    const client = await getDBClient();
    const { rows: productList } = await client.query(`
      select p.*, s.count from products p LEFT JOIN stocks s ON p.id=s.product_id
    `);

    console.log('Lambda getProductsList execution successfully finished', productList)
    return getResponse(200, productList)
  } catch (err) {
    console.log('Lambda getProductsList execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
