import Joi from 'joi'

export const bookingValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required.'
  }),
  date: Joi.date().required().messages({
    'any.required': 'Booking date is required.'
  }),
  hours: Joi.number().min(1).required().messages({
    'number.min': 'Booking hours must be at least 1.',
    'any.required': 'Booking hours are required.'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price must be a positive number.',
    'any.required': 'Price is required.'
  }),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').default('pending')
})

export const bookingUpdateValidationSchema = Joi.object({
  maidId: Joi.string().optional().messages({
    'string.base': 'Maid ID must be a string.'
  }),
  date: Joi.date().optional().messages({
    'date.base': 'Date must be a valid date.'
  }),
  hours: Joi.number().min(1).optional().messages({
    'number.min': 'Booking hours must be at least 1.'
  }),
  price: Joi.number().min(0).optional().messages({
    'number.min': 'Price must be a positive number.'
  }),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional().messages({
    'any.only': 'Status must be one of [pending, confirmed, completed, cancelled].'
  })
})

