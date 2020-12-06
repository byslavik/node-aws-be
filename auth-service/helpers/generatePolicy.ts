import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const policyGenerator = (principalId: string, resource: string, effect: string): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
})