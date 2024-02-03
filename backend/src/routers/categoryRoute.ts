import { Router } from 'express'

import {
  createNewCategory,
  deleteCategoryById,
  deleteCategoryBySlug,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  updateCategoryBySlug,
} from '../controllers/categoryController'
import { categoryValidator} from '../validator/categoryValidator'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const router = Router()

router.get('/', getAllCategories)
// router.get("/:id", getCategoryById);
router.get('/:slug', getCategoryBySlug)
//router.delete("/:id", deleteCategoryById);
router.delete('/:slug', isLoggedIn ,  isAdmin , deleteCategoryBySlug)
router.post('/', isLoggedIn ,  isAdmin , categoryValidator, createNewCategory)
//router.put("/:id", updateCategoryById);
router.put('/:slug', isLoggedIn ,  isAdmin , categoryValidator,  updateCategoryBySlug)

export default router
