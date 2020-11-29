
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

import { policyGenerator } from '../helpers/generatePolicy';
import { getEffect } from '../helpers/getEffect';

export const handler: APIGatewayTokenAuthorizerHandler = (event, _context, cb) => {
  console.log('Auth event', event)

  if (event.type !== 'TOKEN') {
    cb('Unauthorized')
  }

  try {
    const { authorizationToken, methodArn } = event;
    const encCreds = authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encCreds, 'base64').toString('utf-8').split(':');
    const storedPass = process.env[username];

    const effect = getEffect(password, storedPass)
    const policy = policyGenerator(encCreds, methodArn, effect);

    cb(null, policy);
    console.log('Auth execution success', JSON.stringify(policy))
  } catch (err) {
    console.log(`Auth error: ${err.message}`)
    cb(`Unauthorized: ${err.message}`)
  }
}
