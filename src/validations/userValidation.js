import Joi from 'joi'

export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name cannot exceed 50 characters.'
  }),
  dob: Joi.date().required().messages({
    'any.required': 'Date of birth is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email format is invalid.'
  }),
  phone: Joi.string().pattern(/^\d{10}$/).messages({
    'string.pattern.base': 'Phone number must be 10 digits.'
  }),
  address: Joi.string().max(200).messages({
    'string.max': 'Address cannot exceed 200 characters.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters.'
  }),
  role: Joi.string().valid('user', 'maid', 'admin').default('user')

})

export const userUpdateValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name cannot exceed 50 characters.'
  }),
  dob: Joi.date().messages({
    'any.required': 'Date of birth is required.'
  })
  , email: Joi.string().email().messages({
    'string.email': 'Invalid email format.'
  }),
  phone: Joi.string().pattern(/^\d{10}$/).messages({
    'string.pattern.base': 'Phone number must be 10 digits.'
  }),
  address: Joi.string().max(200).messages({
    'string.max': 'Address cannot exceed 200 characters.'
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'Password must be at least 6 characters.'
  }),
  role: Joi.string().valid('user', 'maid', 'admin').messages({
    'any.only': 'Role must be one of [user, maid, admin].'
  })

})
