import * as Joi from '@hapi/joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
