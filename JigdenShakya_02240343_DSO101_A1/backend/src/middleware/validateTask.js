const { body, validationResult } = require('express-validator');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateCreateTask = [
  body('title')
    .exists({ checkFalsy: true }).withMessage('Title is required.')
    .isString().withMessage('Title must be a string.')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('Description must be a string.')
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters.'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('due_date must be a valid ISO 8601 date.'),
  body('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage(`priority must be one of: ${VALID_PRIORITIES.join(', ')}.`),
  handleValidationErrors,
];

const validateUpdateTask = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string.')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('Description must be a string.')
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters.'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601().withMessage('due_date must be a valid ISO 8601 date.'),
  body('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage(`priority must be one of: ${VALID_PRIORITIES.join(', ')}.`),
  body('completed')
    .optional()
    .isBoolean().withMessage('completed must be a boolean.'),
  handleValidationErrors,
];

module.exports = { validateCreateTask, validateUpdateTask };