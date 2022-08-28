import * as Joi from 'joi';
import { cnpj } from 'cpf-cnpj-validator';

export const schemaCreateOperation = Joi.object({
  companyName: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  documentNumber: Joi.string().custom((value, helpers) => {
    if (cnpj.isValid(value)) {
      return true;
    }
    /* eslint-disable */
    // @ts-ignore 
    return helpers.message('DocumentNumber (cpf) is invalid!');
  }),
  password: Joi.string().length(8).required(),
  password_confirmation: Joi.string()
    .valid(Joi.ref('password'))
    .when('password', { is: Joi.exist(), then: Joi.required() }),
}).options({
  abortEarly: false,
});

export const schemaUpdatedOperation = Joi.object({
  companyName: Joi.string().max(15).optional(),
  email: Joi.string().email().optional(),
  documentNumber: Joi.string()
    .custom((value, helper) => {
      if (cnpj.isValid(value)) {
      return true;
    }
    /* eslint-disable */
    // @ts-ignore 
    return helpers.message('DocumentNumber (cpf) is invalid!');
    })
    .optional(),
  password: Joi.string().length(8).optional(),
  password_confirmation: Joi.string()
    .valid(Joi.ref('password'))
    .when('password', { is: Joi.exist(), then: Joi.required() }),
}).options({
  abortEarly: false,
});


export const schemaCreateAuthOperation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(8).required(),
}).options({
  abortEarly: false,
});
