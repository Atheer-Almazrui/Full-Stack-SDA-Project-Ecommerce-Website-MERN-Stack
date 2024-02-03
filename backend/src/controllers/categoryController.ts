import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import slugify from 'slugify'

import { createHttpError } from '../errors/createHttpError'
import * as categoryService from '../services/categoryService'

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 7
    const search = (req.query.search as string) || ''
    const sort = req.query.sort as string

    const { categories, totalPages, currentPage, count } = await categoryService.getCategories(
      page,
      limit,
      search,
      sort
    )

    if (categories.length > 0) {
      res.send({
        message: 'return all the categories',
        payload: {
          categories,
          pagination: {
            totalPages,
            currentPage,
            totalCategories: count,
          },
        },
      })
    } else {
      res.status(200).send({
        message: 'categories is empty',
        payload: {
          categories: [],
          pagination: {
            totalPages: 1,
            currentPage: 1,
            totalCategories: 0,
          },
        },
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const category = await categoryService.findCategoryById(id)
    res.status(200).send({
      message: 'return single product',
      payload: category,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const category = await categoryService.findCategoryBySlug(slug)
    res.status(200).send({
      message: 'return single category',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body

    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const category = await categoryService.createCategory(name)

    res.status(201).send({ message: 'New category is created', payload: category })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const response = await categoryService.removeCategoryById(id)
    res.status(200).send({
      message: 'category is deleted',
      payload: response,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedSlug = req.params.slug
    const resposne = await categoryService.removeCategoryBySlug(requestedSlug)
    res.status(200).send({
      message: 'category is deleted',
      payload: resposne,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const updatedCategory = req.body
    const updatedName = req.body.name

    if (updatedName) {
      req.body.slug = slugify(updatedName)
    }
    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const category = await categoryService.updateCategoryId(id, updatedCategory)

    res.status(200).send({
      message: 'return the updated category',
      payload: category,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedSlug = req.params.slug
    const updatedCategory = req.body
    const updatedName = req.body.name

    if (updatedName) {
      req.body.slug = slugify(updatedName)
    }

    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const category = await categoryService.updateCategorySlug(requestedSlug, updatedCategory)

    res.status(200).send({
      message: 'return the updated category',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
