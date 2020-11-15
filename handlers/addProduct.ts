import { rules } from './../validation/product';
import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import Validator from 'validatorjs';
import { getResponse } from '../helpers';
import { getDBClient } from '../db';

export const handler = async (event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda addProduct invocation with:', event)
    const { body } = event;
    const parsedData = JSON.parse(body);
    const dataValidator = new Validator(parsedData, rules);

    if(dataValidator.fails()) {
        const validationMsg = `Data validation failed`;
        const fields = dataValidator.errors.all()
        console.log('Lambda addProduct data validation failed', validationMsg, fields)

        return getResponse(400, { message: validationMsg, fields })
    }

    const {
        title,
        description,
        price,
        imgUrl,
    } = parsedData;

    const client = await getDBClient();
    const { rowCount } = await client.query(`
        insert into products (title, description, price, imgUrl) values
            ('${title}', '${description}', ${price}, '${imgUrl}');
    `);

    const status = rowCount ? 200 : 404;
    const resBody = rowCount ? { message: 'Item added' } : { message: 'Item not added' };

    console.log('Lambda addProduct execution successfully finished', resBody)

    return getResponse(status, resBody)
  } catch (err) {
    console.log('Lambda addProduct execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
