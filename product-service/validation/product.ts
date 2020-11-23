import { Product } from "../types";
import Validator from "validatorjs";

export let rules = {
    title: 'string|required',
    description: 'string|required',
    imgurl: 'string|required',
    price: 'integer|required',
    count: 'integer|required'
};

export const productValidator = (product: Product) => {
    const dataValidator = new Validator(product, rules);
    return {
      isValid: !dataValidator.fails(),
      fields: dataValidator.errors?.all()
    }
}