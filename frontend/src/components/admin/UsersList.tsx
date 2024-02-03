import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'

import { AppDispatch, RootState } from '../../redux/store'
import {
  banUser,
  fetchUsers,
  grantUserRole,
  removeUser,
  unbanUser
} from '../../redux/slices/users/userSlice'

import Sidebar from './Sidebar'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import '../../styles/adminOperations.scss'
import '../../styles/pagination.scss'

const UsersList = () => {
  const baseURL = import.meta.env.VITE_APP_BASE_URL

  const dispatch = useDispatch<AppDispatch>()
  const { userData, users, pagination } = useSelector((state: RootState) => state.users)

  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(5)

  const fetchData = async () => {
    await dispatch(fetchUsers({ page: currentPage, limit: usersPerPage }))
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, usersPerPage])

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
    dispatch(fetchUsers({ page: currentPage, limit: usersPerPage }))
  }, [dispatch])

  const handleDelete = async (email: string) => {
    const res = await dispatch(removeUser(email))
    res.payload
      ? toast.success('User deleted successuflly')
      : toast.error('User Not found, please refresh the browser')
  }

  const handleBan = async (email: string, isBanned: boolean) => {
    if (isBanned) {
      const res = await dispatch(unbanUser(email))
      res.payload
        ? toast.success('User unbanned successuflly')
        : toast.error('User Not found, please refresh the browser')
    } else {
      const res = await dispatch(banUser(email))
      res.payload
        ? toast.success('User banned successuflly')
        : toast.error('User Not found, please refresh the browser')
    }
  }

  const handleGrantRole = async (email: string, isAdmin: boolean) => {
    try {
      const res = await grantUserRole(email, isAdmin)
      await dispatch(fetchUsers({ page: currentPage, limit: usersPerPage }))
      toast.success(res.message)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="sidebar-container">
        <h1 className="title">Users</h1>
        <div className="table-container">
          <Table className="table">
            <Thead>
              <Tr>
                <Th>User Image</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th>role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => {
                // to avoid display the user to himself when listing the users
                if (user.email !== userData?.email) {
                  return (
                    <Tr key={user._id}>
                      <Td>
                        <img
                          className="td-image"
                          src={`${baseURL}/${user.image}`}
                          alt={user.name}
                        />
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.phone}</Td>
                      <Td>{user.address}</Td>
                      <Td>
                        <i
                          className={
                            user.isAdmin
                              ? 'fa fa-retweet role-icon-admin'
                              : 'fa fa-retweet role-icon-user'
                          }
                          onClick={() => handleGrantRole(user.email, user.isAdmin)}></i>
                        {user.isAdmin ? (
                          <span style={{ color: 'blue' }}>Admin</span>
                        ) : (
                          <span style={{ color: 'black' }}>User</span>
                        )}
                      </Td>
                      <Td>
                        <i
                          className={
                            user.isBanned ? 'fas fa-lock ban-icon' : 'fas fa-lock-open unban-icon'
                          }
                          onClick={() => handleBan(user.email, user.isBanned)}></i>
                        <i
                          className="fa fa-window-close action-icons"
                          onClick={() => handleDelete(user.email)}></i>
                      </Td>
                    </Tr>
                  )
                }
              })}
            </Tbody>
          </Table>

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

export default UsersList
