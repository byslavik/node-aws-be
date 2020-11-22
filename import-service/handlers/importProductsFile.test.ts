import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from './importProductsFile';

describe('handler', () => {
    it('Should return 400 in case of passed file is not csv', async () => {
        const event = { queryStringParameters: { name: 'test.xlsx' } } as unknown as APIGatewayProxyEvent;
        const result = await handler(event, {} as Context, () => { }) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(400)
        expect(result.body).toBe(JSON.stringify({
            message: "Unsupported file format. Service supports only csv"
        }))
    });
    it('Should send signed url', async () => {
        AWSMock.setSDKInstance(AWS);
        const signedUrlMock = 'http://signed.url';
        const event = { queryStringParameters: { name: 'test.csv' } } as unknown as APIGatewayProxyEvent;
        AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
            console.log('S3', 'getSignedUrl', 'mock called')
            callback(null, signedUrlMock)
        });

        const result = await handler(event, {} as Context, () => { }) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(200)
        expect(result.body).toBe(JSON.stringify({
            signedUrl: signedUrlMock
        }))
        AWSMock.restore('S3');
    });
    it('Should throw an error', async () => {
        AWSMock.setSDKInstance(AWS);
        const event = { queryStringParameters: { name: 'test.csv' } } as unknown as APIGatewayProxyEvent;
        AWSMock.mock('S3', 'getSignedUrl', (_action, _params, _callback) => {
            console.log('S3', 'getSignedUrl', 'mock called')
            throw new Error('Boom!')
        });

        const result = await handler(event, {} as Context, () => { }) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(500)
        expect(result.body).toBe(JSON.stringify({
            message: 'Boom!'
        }))
        AWSMock.restore('S3');

    });
})