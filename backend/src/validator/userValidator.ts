//userValidator.ts
import { check, ValidationChain } from 'express-validator'

export const userValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('User name should be at least 3-200 characters long'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  check('phone').trim().notEmpty().withMessage('Phone number is required'),
]
