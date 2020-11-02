import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { cars } from '../mocks';
import { emulateRequest, getResponse } from '../helpers';

export const handler = async (_event, _context): Promise<APIGatewayProxyResult> => {
  try {
    const carsData = await emulateRequest(cars, 10);

    return getResponse(200, carsData)
  } catch (err) {
    return getResponse(500, err.message)
  }
}
