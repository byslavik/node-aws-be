import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { toys } from '../mocks';
import { emulateRequest, getResponse } from '../helpers';

export const handler = async (_event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda getProductsList invocation with:', _event)
    const carsData = await emulateRequest(toys, 10);
    const body = JSON.parse(carsData)
    console.log('Lambda getProductsList execution successfully finished', body)
    return getResponse(200, body)
  } catch (err) {
    console.log('Lambda getProductsList execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
