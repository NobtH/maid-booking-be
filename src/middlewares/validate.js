import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name cannot exceed 50 characters.'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email format is invalid.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters.'
  }),
  phone: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.empty': 'Phone number is required.',
    'string.pattern.base': 'Phone number must be 10 digits.'
  }),
  address: Joi.string().max(200).optional().messages({
    'string.max': 'Address cannot exceed 200 characters.'
  }),
  role: Joi.string().valid('user', 'maid', 'admin').default('user'),
  age: Joi.when('role', {
    is: 'maid',
    then: Joi.number().integer().min(18).required().messages({
      'number.base': 'Age must be a number.',
      'number.min': 'Age must be at least 18.',
      'any.required': 'Age is required for maids.'
    }),
    otherwise: Joi.forbidden()
  }),
  experience: Joi.when('role', {
    is: 'maid',
    then: Joi.number().integer().min(0).required().messages({
      'number.base': 'Experience must be a number.',
      'number.min': 'Experience cannot be negative.',
      'any.required': 'Experience is required for maids.'
    }),
    otherwise: Joi.forbidden()
  }),
  // hourlyRate: Joi.when('role', {
  //   is: 'maid',
  //   then: Joi.number().min(0).required().messages({
  //     'number.base': 'Hourly rate must be a number.',
  //     'number.min': 'Hourly rate cannot be negative.',
  //     'any.required': 'Hourly rate is required for maids.'
  //   }),
  //   otherwise: Joi.forbidden()
  // }),
  location: Joi.when('role', {
    is: 'maid',
    then: Joi.string().required().messages({
      'string.empty': 'Location is required for maids.'
    }),
    otherwise: Joi.forbidden()
  }),
  description: Joi.string().max(1000).optional().messages({
    'string.max': 'Address cannot exceed 1000 characters.'
  }),
});

export const validateRegister = (req, res, next) => {
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

