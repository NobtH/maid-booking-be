import Joi from 'joi'

export const reviewValidationSchema = Joi.object({
  bookingId: Joi.string().required().messages({
    'any.required': 'Booking ID is required.'
  }),
  maidId: Joi.string().required().messages({
    'any.required': 'Maid ID is required.'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required.'
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    'number.min': 'Rating must be at least 1.',
    'number.max': 'Rating cannot exceed 5.',
    'any.required': 'Rating is required.'
  }),
  comment: Joi.string().allow('').messages({
    'string.base': 'Comment must be a string.'
  })
})


export const reviewUpdateValidationSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional().messages({
    'number.min': 'Rating must be at least 1.',
    'number.max': 'Rating cannot exceed 5.'
  }),
  comment: Joi.string().allow('').optional().messages({
    'string.base': 'Comment must be a string.'
  })
})