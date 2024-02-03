import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slugify from 'slugify'

import { createHttpError } from '../errors/createHttpError'
import { deleteImage } from '../helper/deleteImage'
import { Product } from '../models/productModel'
import * as productService from '../services/productService'




export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const minPrice = Number(req.query.minPrice) || 0
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_VALUE
    const categoryId = (req.query.category as string) || ''
    const sort = req.query.sort as string
    const search = (req.query.search as string) || ''

    const { products, totalPages, currentPage, count } = await productService.getProducts(
      page,
      limit,
      minPrice,
      maxPrice,
      sort,
      categoryId,
      search
    )

    if (products.length > 0) {
      res.send({
        message: 'return all the products',
        payload: {
          products,
          pagination: {
            totalPages,
            currentPage,
            totalProducts: count,
          },
        },
      })
    } else {
      res.status(200).send({
        message: 'products is empty',
        payload: {
          products: [],
          pagination: {
            totalPages: 1,
            currentPage: 1,
            totalProducts: 0,
          },
        },
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const product = await productService.findProductsBySlug(slug)
    res.send({
      message: 'get a single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const product = await productService.removeProductsBySlug(slug)

    // to delete the image from the public/images/products folder
    product && deleteImage(product.image, 'products')

    res.send({
      message: 'single product is deleted',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name
    const slug = req.params.slug
    if (name) req.body.slug = slugify(name)

    const updatedProduct = { ...req.body, image: req.file?.path }

    const productExists = await Product.findOne({ slug: req.body.slug })

    if (productExists && name !== productExists.name) {
      updatedProduct.image && deleteImage(updatedProduct.image, 'products')
      throw createHttpError(409, 'Product name is already exists')
    }

    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      updatedProduct.image && deleteImage(updatedProduct.image, 'products')
      return res.status(400).json({ errors: errors.array() })
    }

    // to delete(replace it) the old image from the public/images/products folder
    const prevProduct = await productService.findProductsBySlug(slug)
    req.file?.path && deleteImage(prevProduct.image, 'products')

    const product = await productService.updateProduct(slug, updatedProduct)

    res.send({ message: 'product is updated', payload: product })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body
    const image = req.file?.path as string

    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      image && deleteImage(image, 'products')
      return res.status(400).json({ errors: errors.array() })
    }

    const product = await productService.createNewProduct(image, productData)

    res.status(201).send({ message: 'product is created', payload: product })
  } catch (error) {
    next(error)
  }
}

