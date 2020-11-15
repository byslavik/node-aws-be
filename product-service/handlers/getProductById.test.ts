import { handler } from './getProductById';
import { Context } from 'aws-lambda';

const contextMock = {} as Context;

describe('getProductsId handler', () => {
    it('should return data and set 200 status', async () => {
        const response = await handler({ pathParameters: { productId: '0' } }, contextMock);

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toBeInstanceOf(Object)
    });

    it('should return error message and set 404 status if no car item', async () => {
        const response = await handler({ pathParameters: { productId: 'smth' } }, contextMock);

        expect(response.statusCode).toBe(404)
        expect(response.body).toBe(JSON.stringify({ message: 'Item not found' }))
    });

    it('should return error message and set 500 status if there is internal error', async () => {
        const response = await handler({}, contextMock);

        expect(response.statusCode).toBe(500)
        expect(response.body).toBe(JSON.stringify({ message: "Cannot destructure property `productId` of 'undefined' or 'null'." }))
    });
}) 