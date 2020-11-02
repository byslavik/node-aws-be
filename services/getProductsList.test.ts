import { handler } from './getProductsList';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const eventMock = {} as APIGatewayProxyEvent;
const contextMock = {} as Context;

describe('getProductsList microservice', () => {
    it('should return data and set 200 status', async () => {
        const response = await handler(eventMock, contextMock);

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toBeInstanceOf(Array)
    });
}) 