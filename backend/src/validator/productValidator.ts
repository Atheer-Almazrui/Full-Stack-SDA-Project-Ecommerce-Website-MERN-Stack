//productValidator.ts
import { check, ValidationChain } from 'express-validator'


export const createProductValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be at least 3-200 characters long'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3 })
    .withMessage('Description should be at least 3 characters long'),
  check('quantity')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  check('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number'),
  check('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
]

export const updateProductValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be at least 3-200 characters long'),
  check('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3 })
    .withMessage('Description should be at least 3 characters long'),
  check('quantity')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  check('price')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number'),
  check('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
]
