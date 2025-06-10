import Joi from "joi"

export const registerValidate = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})