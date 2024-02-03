import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import {
  Product,
  fetchProducts,
  searchProductByName,
  sortProducts
} from '../redux/slices/products/productSlice'
import { AppDispatch, RootState } from '../redux/store'

import HeroSection from '../components/HeroSection'
import '../styles/home.scss'
import '../styles/pagination.scss'
import { addToCart } from '../redux/slices/cart/cartSlice'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const baseURL = import.meta.env.VITE_APP_BASE_URL

  const { searchWord, products, pagination, isLoading } = useSelector(
    (state: RootState) => state.products
  )
  const { categories } = useSelector((state: RootState) => state.categories)
  const { userData } = useSelector((state: RootState) => state.users)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(4)

  const [priceRange, setPriceRange] = useState([0, 10000]) // the initial price range

  const fetchData = async () => {
    const res = await dispatch(
      fetchProducts({ page: currentPage, limit: productsPerPage, priceRange: priceRange })
    )
    // if (res.meta.requestStatus === 'rejected') {
    //   toast.error(res.payload.message)
    // } else if (res.meta.requestStatus === 'fulfilled') {
    //   toast.success(res.payload.message)
    // }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, productsPerPage, priceRange])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value
    dispatch(searchProductByName(searchTerm))
  }

  const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortedType = event.target.value
    dispatch(sortProducts(sortedType))
  }

  const handleCategoryFilter = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handlePriceRangeChange = async (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number])
    }
  }

  const searchedProducts = searchWord
    ? products.filter((product) => product.name.toLowerCase().includes(searchWord.toLowerCase()))
    : products

  const filteredProducts =
    selectedCategories.length > 0
      ? searchedProducts.filter((product) => selectedCategories.includes(product.category._id))
      : searchedProducts

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pagination.totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    toast.success('Item added to cart ✨🛒')
  }

  const handleProductsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10)
    setProductsPerPage(value)
  }

  return (
    <div>
      <HeroSection />
      <div className="grid-container">
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="🔎  Discover Amazing Products.."
            value={searchWord}
            onChange={handleSearch}
          />
          <select className="select" name="sort" id="sort" onChange={handleSort}>
            <option hidden>🠕🠗 Sort by</option>
            <option value="priceASC">Price: Low to High</option>
            <option value="priceDESC">Price: High to Low</option>
            <option value="nameASC">Name: A to Z</option>
            <option value="nameDESC">Name: Z to A</option>
          </select>
          <select
            className="select"
            name="productsPerPage"
            id="productsPerPage"
            onChange={handleProductsPerPageChange}>
            <option hidden>🗐 products per page</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={pagination.totalProducts}>All</option>
          </select>
        </div>
        <div className="category-buttons">
          <button
            className={selectedCategories.length === 0 ? 'active' : ''}
            onClick={() => setSelectedCategories([])}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className={selectedCategories.includes(category._id) ? 'active' : ''}
              onClick={() => handleCategoryFilter(category._id)}>
              {category.name}
            </button>
          ))}
        </div>
        <div className="price-slider">
          <p className="price-range">Price Range:</p>
          <div className="slider-div">
            <p className="price-range">${priceRange[0]}</p>
            <Slider
              range
              min={0}
              max={10000}
              value={priceRange}
              onChange={handlePriceRangeChange}
            />
            <p className="price-range">${priceRange[1]}</p>
          </div>
        </div>
        <div className="grid">
          {filteredProducts.length > 0 &&
            filteredProducts.map((product: Product) => (
              <div className="card" key={product._id}>
                <Link to={`/product/${product.slug}`}>
                  <img src={`${baseURL}/${product.image}`} alt={product.name} />
                </Link>

                <h3>{product.name}</h3>
                <span>{product.description}</span>
                {Number(product.quantity) - Number(product.sold) > 0 ? (
                  <span>In stock: {Number(product.quantity) - Number(product.sold)}</span>
                ) : (
                  <span>Out of stock</span>
                )}
                <h2>${product.price}</h2>
                {!userData?.isAdmin && (
                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                )}
              </div>
            ))}
          {isLoading && <h1 style={{ color: 'white' }}>Products are loading...</h1>}

          {filteredProducts.length === 0 && !isLoading && (
            <h2 style={{ color: 'white' }}>No products found</h2>
          )}
        </div>
        <div className="pagination">
          <button
            disabled={pagination.currentPage === 1}
            onClick={handlePrevPage}
            className="pagination-button">
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-button ${
                  pagination.currentPage === index + 1 ? 'active' : ''
                }`}
                onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={handleNextPage}
            className="pagination-button">
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Home
