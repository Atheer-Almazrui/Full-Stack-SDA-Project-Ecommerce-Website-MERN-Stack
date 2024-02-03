import slugify from 'slugify'

import { Category, ICategory } from '../models/categoryModel'
import { createHttpError } from '../errors/createHttpError'
import { sortItems } from '../helper/sortItems'
import { searchItems } from '../helper/searchItems'

export const getCategories = async (page: number, limit: number, search: string, sort: string) => {
  // pagination
  const count = await Category.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = 0
  // to check if categories is empty or not
  if (count > 0) {
    skip = (page - 1) * limit
  }
  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')
  // search category by its name
  const searchCategory = searchItems({ search })
  // sort by name, by date Added
  const sortOption = sortItems(sort)

  const categories: ICategory[] = await Category.find(searchCategory)
    .skip(skip)
    .limit(limit)
    .collation({
      locale: 'en',
      strength: 2,
    })
    .sort(sortOption)

  return { categories, totalPages, currentPage: page, count }
}

export const findCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findOne({ _id: id })
  if (!category) {
    const error = createHttpError(404, 'category does not exist with this id')
    throw error
  }
  return category
}

export const findCategoryBySlug = async (slug: string): Promise<ICategory> => {
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    const error = createHttpError(404, 'category is not found with this slug')
    throw error
  }
  return category
}

export const createCategory = async (name: string) => {
  const categoryExist = await Category.exists({ name })

  if (categoryExist) {
    throw createHttpError(409, 'Category already exists with this name')
  }

  const newCategory = new Category({
    name,
    slug: slugify(name),
  })

  return await newCategory.save()
}

export const removeCategoryById = async (requestedId: string) => {
  const category = await Category.findByIdAndDelete(requestedId)
  if (!category) {
    const error = createHttpError(404, 'category is not found with this id')
    throw error
  }
  return category
}

export const removeCategoryBySlug = async (requestedSlug: string) => {
  const category = await Category.findOneAndDelete({ slug: requestedSlug })
  if (!category) {
    const error = createHttpError(404, 'category is not found with this slug')
    throw error
  }
  return category
}

export const updateCategoryId = async (
  id: string,
  updatedCategory: ICategory
): Promise<ICategory> => {
  const category = await Category.findByIdAndUpdate(id, updatedCategory, {
    new: true,
  })

  if (!category) {
    const error = createHttpError(404, 'category does not exist with this id')
    throw error
  }

  return category
}

export const updateCategorySlug = async (
  slug: string,
  updatedCategory: ICategory
): Promise<ICategory> => {
  const category = await Category.findOneAndUpdate({ slug: slug }, updatedCategory, {
    new: true,
  })

  if (!category) {
    const error = createHttpError(404, 'category does not exist with this slug')
    throw error
  }

  return category
}
