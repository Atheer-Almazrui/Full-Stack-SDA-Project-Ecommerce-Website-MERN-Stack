import slugify from 'slugify'

import { sortItems } from '../helper/sortItems'
import { Product, IProduct } from '../models/productModel'
import { createHttpError } from '../errors/createHttpError'
import { deleteImage } from '../helper/deleteImage'
import { searchItems } from '../helper/searchItems'

export const getProducts = async (
  page: number,
  limit: number,
  minPrice: number,
  maxPrice: number,
  sort: string,
  categoryId: string,
  search: string
) => {
  // pagination
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)
  
  if (page > totalPages) {
    page = totalPages
  }

  let skip = 0
  // to check if products is empty or not
  if (count > 0) {
    skip = (page - 1) * limit
  }

  // search AND filter by price, by categoryid
  const filterProduct = searchItems({ search, minPrice, maxPrice, categoryId })

  // sort by name, by date Added, by price
  const sortOption = sortItems(sort)

  const products: IProduct[] = await Product.find(filterProduct)
    .skip(skip)
    .populate('category')
    .limit(limit)
    .collation({
      locale: 'en',
      strength: 2,
    })
    .sort(sortOption)

  return {
    products,
    totalPages,
    currentPage: page,
    count,
  }
}

export const findProductsBySlug = async (slug: string): Promise<IProduct> => {
  const product = await Product.findOne({ slug: slug }).populate('category', '_id name slug')

  if (!product) {
    throw createHttpError(404, 'Product Not found')
  }
  return product
}

export const removeProductsBySlug = async (slug: string) => {
  const product = await Product.findOneAndDelete({ slug: slug })
  if (!product) {
    throw createHttpError(404, 'Product Not found')
  }
  return product
}

export const updateProduct = async (slug: string, updatedProduct: IProduct): Promise<IProduct> => {
  const product = await Product.findOneAndUpdate({ slug }, updatedProduct, {
    new: true,
  }).populate('category', '_id name slug')

  if (!product) {
    const error = createHttpError(404, 'Product not found')
    throw error
  }

  return product
}

export const createNewProduct = async (image: string, productData: IProduct) => {
  const { name, description, quantity, price, category, sold } = productData

  const productExist = await Product.exists({ name: name })

  if (productExist) {
    image && deleteImage(image, 'products')
    const error = createHttpError(409, 'Product already exists with this name')
    throw error
  }

  const newProduct: IProduct = new Product({
    name: name,
    slug: slugify(name),
    description: description,
    quantity: Number(quantity),
    price: Number(price),
    category: category,
    image: image,
    sold: sold && Number(sold),
  })

  return await newProduct.save()
}
