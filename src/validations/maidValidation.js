import Joi from 'joi'

export const maidCreateValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required.'
  }),
  experience: Joi.number().min(0).required().messages({
    'number.min': 'Experience must be a non-negative number.',
    'any.required': 'Experience is required.'
  }),
  hourlyRate: Joi.number().min(0).required().messages({
    'number.min': 'Hourly rate must be a non-negative number.',
    'any.required': 'Hourly rate is required.'
  }),
  location: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Location must be at least 3 characters.',
    'string.max': 'Location cannot exceed 100 characters.',
    'any.required': 'Location is required.'
  })
});

export const maidUpdateValidationSchema = Joi.object({
  experience: Joi.number().min(0).optional().messages({
    'number.min': 'Experience must be a non-negative number.',
    'any.required': 'Experience is required.'
  }),
  hourlyRate: Joi.number().min(0).optional().messages({
    'number.min': 'Hourly rate must be a non-negative number.',
    'any.required': 'Hourly rate is required.'
  }),
  location: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Location must be at least 3 characters.',
    'string.max': 'Location cannot exceed 100 characters.',
    'any.required': 'Location is required.'
  })
});