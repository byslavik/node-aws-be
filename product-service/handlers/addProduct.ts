import { APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { productValidator } from '../validation/product';
import { getResponse } from '../../helpers';
import { getDBClient } from '../db';
import { Product } from '../types';

export const createProducts = async (products: Product[], client) => {
  console.log('Start create products helper', products);
  const validatedProducts = products.map(productValidator);
  const isProductsValid = validatedProducts.every(({ isValid }) => isValid);

  if (!isProductsValid) {
    const validationMsg = `Data validation failed`;
    const fields =  validatedProducts.map(({ fields }) => fields).filter(Boolean);

    console.log('Data validation failed', validationMsg, fields);

    return getResponse(400, { message: validationMsg, fields })
  }

  const productValuesToInsert = products.map(({
    title,
    description,
    price,
    imgurl
  }) => `('${title}', '${description}', ${price}, '${imgurl}')`).join(',');

  console.log('productValuesToInsert', productValuesToInsert)

  const { rows, rowCount } = await client.query(`
        insert into products (title, description, price, imgurl) values ${productValuesToInsert} RETURNING id;
    `);

  const status = rowCount ? 200 : 404;
  const resBody = rowCount ? { message: 'Item added' } : { message: 'Item not added' };

  if (rowCount) {
    const stockValuesToInsert = rows.map(({ id }, index) => `('${id}', ${products[index]?.count})`).join(',');
    console.log('stockValuesToInsert', stockValuesToInsert)

    const { rowCount: stockRowCount } = await client.query(`
        insert into stocks (product_id, count) values ${stockValuesToInsert};
    `);

    resBody.message += stockRowCount ? '. Stocks updated' : '. Stocks not updated'
  }
  console.log('finishing createProducts', resBody)
  return getResponse(status, resBody)
}

export const handler = async (event, _context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Lambda addProduct invocation with:', event)
    const { body } = event;
    const parsedData = JSON.parse(body);
    const client = await getDBClient();
    const result = await createProducts([parsedData], client);

    return result
  } catch (err) {
    console.log('Lambda addProduct execution failed with error', err)
    return getResponse(500, { message: err.message })
  }
}
