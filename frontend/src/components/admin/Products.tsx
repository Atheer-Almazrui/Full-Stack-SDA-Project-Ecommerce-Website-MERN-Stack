import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Product,
  addProduct,
  fetchProducts,
  removeProduct,
  updateProduct
} from '../../redux/slices/products/productSlice'
import { AppDispatch, RootState } from '../../redux/store'

import Sidebar from './Sidebar'
import '../../styles/adminOperations.scss'
import '../../styles/pagination.scss'
import { fetchCategories } from '../../redux/slices/categories/categorySlice'

const initialProductState: Product = {
  _id: '',
  name: '',
  slug: '',
  image: '',
  description: '',
  category: {
    _id: '',
    name: '',
    slug: ''
  },
  price: '0',
  quantity: '0',
  sold: '1'
}

const Products = () => {
  const dispatch = useDispatch<AppDispatch>()
  const baseURL = import.meta.env.VITE_APP_BASE_URL

  const [product, setProduct] = useState<Product>(initialProductState)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedID, setEditedID] = useState('')
  const [editedProduct, setEditedProduct] = useState<Product>(product)

  const { products, pagination } = useSelector((state: RootState) => state.products)
  const { categories } = useSelector((state: RootState) => state.categories)

  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(4)

  const fetchData = async () => {
    await dispatch(
      fetchProducts({ page: currentPage, limit: productsPerPage, priceRange: [0, 10000] })
    )
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, productsPerPage, dispatch])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pagination.totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target as HTMLInputElement | HTMLTextAreaElement
    if (isEditing) {
      if (type === 'file') {
        setSelectedImage((event.target as HTMLInputElement).files?.[0] || null)

        const fileInput = (event.target as HTMLInputElement) || ''
        setEditedProduct((prevProductData) => ({
          ...prevProductData,
          [name]: fileInput.files?.[0]
        }))
      } else {
        setEditedProduct({
          ...editedProduct,
          [name]: value
        })
      }
    } else {
      if (type === 'file') {
        setSelectedImage((event.target as HTMLInputElement).files?.[0] || null)

        const fileInput = (event.target as HTMLInputElement) || ''
        setProduct((prevProductData) => ({
          ...prevProductData,
          [name]: fileInput.files?.[0]
        }))
      } else {
        setProduct({
          ...product,
          [name]: value
        })
      }
    }
  }

  const handleAddClick = () => {
    setIsAdding(true)
  }

  const handleEditClick = (product: Product) => {
    setEditedProduct(product)
    setEditedID(product._id)
    setIsEditing(true)
  }

  const handleUpdateProduct = () => {
    const res = dispatch(updateProduct(editedProduct)).then(() => {
      dispatch(fetchProducts({ page: currentPage, limit: productsPerPage, priceRange: [0, 10000] }))
    })
    setIsEditing(false)
    setEditedID('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsAdding(false)

    const formData = new FormData()

    formData.append('name', product.name)
    formData.append('image', product.image)
    formData.append('description', product.description)
    formData.append('category', String(product.category))
    formData.append('price', product.price)
    formData.append('quantity', product.quantity)
    formData.append('sold', product.sold)

    if (
      product.name === '' ||
      product.description === '' ||
      product.price === '' ||
      product.quantity === '' ||
      product.category.name === ''
    ) {
      toast.error('You have to enter all required feilds')
      return
    } else {
      const res = await dispatch(addProduct(formData)).then(async () => {
        await dispatch(
          fetchProducts({ page: currentPage, limit: productsPerPage, priceRange: [0, 10000] })
        )
      })

      //res.type === 'success' ? toast.success(res.message) : toast.error(res.message)
    }

    // Reset the form
    setProduct(initialProductState)
    setSelectedImage(null)
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="sidebar-container">
        <h1 className="title">Products</h1>
        <button className="floating-button" onClick={handleAddClick}>
          +
        </button>
        <div className="table-container">
          <form onSubmit={handleSubmit}>
            <Table className="table">
              <Thead>
                <Tr>
                  <Th>Image</Th>
                  <Th>Name*</Th>
                  <Th>Description*</Th>
                  <Th>Category*</Th>
                  <Th>quantity*</Th>
                  <Th>sold</Th>
                  <Th>Price*</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isAdding && (
                  <Tr>
                    <Td>
                      <div className="file-upload">
                        <input
                          type="file"
                          id="upload"
                          name="image"
                          accept="image/*"
                          className="file-upload__input"
                          onChange={handleChange}
                        />
                        <label htmlFor="upload" className="file-upload__label">
                          {selectedImage ? selectedImage.name : 'Choose image'}
                        </label>
                      </div>
                    </Td>
                    <Td>
                      <input
                        className="input-field"
                        type="text"
                        name="name"
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <input
                        className="input-field"
                        type="text"
                        name="description"
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <select className="input-field" name="category" onChange={handleChange}>
                        {categories.map((category) => (
                          <Fragment key={category._id}>
                            <option hidden>choose category</option>
                            <option value={category._id}>{category.name}</option>
                          </Fragment>
                        ))}
                      </select>
                    </Td>
                    <Td>
                      <input
                        className="input-field"
                        type="number"
                        name="quantity"
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <input
                        className="input-field"
                        type="number"
                        name="sold"
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <input
                        className="input-field"
                        type="text"
                        name="price"
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <button className="save-update-buttons" type="submit">
                        Save
                      </button>
                    </Td>
                  </Tr>
                )}
                {products.map((product) => (
                  <Fragment key={product._id}>
                    {isEditing && editedID == product._id && (
                      <Tr>
                        <Td>
                          <div className="file-upload">
                            <input
                              type="file"
                              id="upload"
                              name="image"
                              accept="image/*"
                              className="file-upload__input"
                              onChange={handleChange}
                            />
                            <label htmlFor="upload" className="file-upload__label">
                              {selectedImage ? selectedImage.name : 'Update image'}
                            </label>
                          </div>
                        </Td>
                        <Td>
                          <input
                            className="input-field"
                            type="text"
                            name="name"
                            value={editedProduct.name}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <input
                            className="input-field"
                            type="text"
                            name="description"
                            value={editedProduct.description}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <select className="input-field" name="category" onChange={handleChange}>
                            {categories.map((category) => (
                              <Fragment key={category.slug}>
                                <option hidden>{editedProduct.category.name}</option>
                                <option value={category._id}>{category.name}</option>
                              </Fragment>
                            ))}
                          </select>
                        </Td>
                        <Td>
                          <input
                            className="input-field"
                            type="number"
                            name="quantity"
                            value={editedProduct.quantity}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <input
                            className="input-field"
                            type="number"
                            name="sold"
                            value={editedProduct.sold}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <input
                            className="input-field"
                            type="text"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <button
                            className="save-update-buttons"
                            type="button"
                            onClick={handleUpdateProduct}>
                            Update
                          </button>
                        </Td>
                      </Tr>
                    )}

                    <Tr>
                      <Td className="td-image">
                        <img src={`${baseURL}/${product.image}`} alt={product.name} />
                      </Td>
                      <Td>{product.name}</Td>
                      <Td>{product.description}</Td>
                      <Td>
                        {product && product.category && (
                          <p className="category">{product.category.name}</p>
                        )}
                      </Td>
                      <Td>{product.quantity}</Td>
                      <Td>{product.sold}</Td>
                      <Td>${product.price}</Td>
                      <Td>
                        <i
                          className="fa fa-pencil action-icons"
                          onClick={() => handleEditClick(product)}></i>
                        <i
                          className="fa fa-window-close action-icons"
                          onClick={async () => await dispatch(removeProduct(product.slug))}></i>
                      </Td>
                    </Tr>
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </form>
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
      </div>
      <ToastContainer />
    </div>
  )
}

export default Products
