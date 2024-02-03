import { useDispatch, useSelector } from 'react-redux'
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'

import { AppDispatch, RootState } from '../../redux/store'
import {
  Category,
  addCategory,
  fetchCategories,
  removeCategory,
  updateCategory
} from '../../redux/slices/categories/categorySlice'

import Sidebar from './Sidebar'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import '../../styles/pagination.scss'

const initialCategoryState: Category = {
  _id: '',
  name: '',
  slug: ''
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [categoryName, setCategoryName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editedID, setEditedID] = useState('')
  const [editedCategory, setEditedCategory] = useState<Partial<Category>>(initialCategoryState)

  const { categories, pagination } = useSelector((state: RootState) => state.categories)

  const [currentPage, setCurrentPage] = useState(1)
  const [categoriesPerPage, setCategoriesPerPage] = useState(7)

  const fetchData = async () => {
    await dispatch(fetchCategories({ page: currentPage, limit: categoriesPerPage }))
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, categoriesPerPage, dispatch])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pagination.totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, limit: categoriesPerPage }))
  }, [dispatch])

  const handleAddClick = () => {
    setIsAdding(true)
  }

  const handleEditClick = (category: Category) => {
    setEditedCategory(category)
    setEditedID(category._id)
    setIsEditing(true)
  }

  const handleUpdateCategory = () => {
    dispatch(updateCategory(editedCategory))
    setIsEditing(false)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCategoryName = event.target.value

    if (isEditing) {
      setEditedCategory({ slug: editedCategory.slug, name: newCategoryName })
    } else {
      setCategoryName(newCategoryName)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    dispatch(addCategory(categoryName))

    setIsAdding(false)
    // Reset the form
    setCategoryName('')
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="sidebar-container">
        <h1 className="title">Categories</h1>
        <button className="floating-button" onClick={handleAddClick}>
          +
        </button>
        <div className="table-container">
          <form onSubmit={handleSubmit}>
            <Table className="table">
              <Thead>
                <Tr>
                  <Th>Category Name</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isAdding && (
                  <Tr>
                    <Td>
                      <input
                        className="input-field"
                        type="text"
                        name="name"
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
                {categories.map((category) => (
                  <Fragment key={category._id}>
                    {isEditing && editedID == category._id && (
                      <Tr>
                        <Td>
                          <input
                            className="input-field"
                            type="text"
                            name="name"
                            value={editedCategory.name}
                            onChange={handleChange}
                          />
                        </Td>
                        <Td>
                          <button
                            className="save-update-buttons"
                            type="button"
                            onClick={handleUpdateCategory}>
                            Update
                          </button>
                        </Td>
                      </Tr>
                    )}
                    <Tr>
                      <Td>{category.name}</Td>
                      <Td>
                        <i
                          className="fa fa-pencil action-icons"
                          onClick={() => handleEditClick(category)}></i>
                        <i
                          className="fa fa-window-close action-icons"
                          onClick={() => dispatch(removeCategory(category.slug))}></i>
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
    </div>
  )
}

export default Categories
