import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../redux/store'
import { fetchProducts, fetchSingleProduct } from '../redux/slices/products/productSlice'
import { fetchCategories } from '../redux/slices/categories/categorySlice'

import '../styles/productDetails.scss'

const ProductDetails = () => {
  const { slug } = useParams()
  const baseURL = import.meta.env.VITE_APP_BASE_URL

  const dispatch = useDispatch<AppDispatch>()
  const { singleProduct, isLoading, error } = useSelector((state: RootState) => state.products)
  const { userData } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchProducts())
      .then(() => dispatch(fetchSingleProduct(String(slug))))
      .then(() => dispatch(fetchCategories()))
  }, [])

  // if (isLoading) {
  //   return <h1>Product is loading...</h1>
  // }
  // if (error) {
  //   return <h1>{error}</h1>
  // }

  return (
    <div className="product-page">
      <div className="product-card">
        {singleProduct && (
          <>
            <div className="product-image">
              <img src={`${baseURL}/${singleProduct?.image}`} alt={singleProduct.name} />
            </div>
            <div className="product-details">
              <h2 className="product-name">{singleProduct.name}</h2>
              <p className="product-description">{singleProduct.description}</p>
              <p>Category : </p>
              <div className="product-categories">
                <span className="category">{singleProduct?.category?.name}</span>
              </div>
              <p className="product-price">${singleProduct.price}</p>
              {!userData?.isAdmin && <button className="add-to-cart-btn">Add to Cart</button>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
