import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { toys } from '../mocks';
import { Toy } from '../types';
import { emulateRequest, getResponse } from '../helpers';

export const handler = async (event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda getProductById invocation with:', event)
    const { pathParameters: { productId } } = event;
    const carsData: Toy[] = await emulateRequest(toys, 10).then(data => JSON.parse(data));
    const product = carsData.find(toy => toy.id === productId);
    const status = product ? 200 : 404;
    const body = product || { message: 'Item not found' };
    console.log('Lambda getProductById execution successfully finished', body)
    return getResponse(status, body)
  } catch (err) {

    console.log('Lambda getProductById execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
