const Joi = require('joi');

const envSchema = Joi.object({
    PORT: Joi.number().required(),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required()
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
    console.error("ENV validation error:", error.message);
    process.exit(1);
}

module.exports = value;