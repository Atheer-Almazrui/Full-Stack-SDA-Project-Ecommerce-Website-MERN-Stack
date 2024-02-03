//categoryValidator.ts
import { check, ValidationChain } from 'express-validator'

export const categoryValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Category name should be at least 3-200 characters long'),

]
