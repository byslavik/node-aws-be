import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { cars, Car } from '../mocks';
import { emulateRequest, getResponse } from '../helpers';

export const handler = async (event, _context): Promise<APIGatewayProxyResult> => {
  try {
    const { pathParameters: { productId } } = event;
    const carsData: Car[] = await emulateRequest(cars, 10).then(data => JSON.parse(data));
    const product = carsData.find(car => car.id === productId);
    const status = product ? 200 : 404;
    const body = product ? JSON.stringify(product) : 'Item not found';

    return getResponse(status, body)
  } catch (err) {
    return getResponse(500, err.message)
  }
}
