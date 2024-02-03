import { Router } from 'express'

import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from '../controllers/productController'
import { uploadImageProduct } from '../middlewares/uploadFile'
import { updateProductValidator, createProductValidator } from '../validator/productValidator'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const router = Router()

// GET : /products -> return all products
router.get('/', getAllProducts)

// GET : /products/:slug -> return single product by slug
router.get('/:slug', getProductBySlug)

// DELETE : /products/:slug -> delete single product by slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteProductBySlug)

// PUT : /products/:slug -> update product by slug
router.put(
  '/:slug',
  isLoggedIn,
  isAdmin,
  uploadImageProduct.single('image'),
  // updateProductValidator,
  updateProductBySlug
)

// POST : /products -> create a new product
router.post('/', isLoggedIn ,  isAdmin , uploadImageProduct.single('image'), createProductValidator, createProduct)

export default router
