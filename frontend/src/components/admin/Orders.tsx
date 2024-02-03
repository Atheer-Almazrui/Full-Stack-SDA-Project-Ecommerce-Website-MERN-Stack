import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../redux/store'
import { removeOrder } from '../../redux/slices/orders/orderSlice'

import Sidebar from './Sidebar'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { orders, isLoading, error } = useSelector((state: RootState) => state.orders)

  if (isLoading) {
    return <h1>Orders are loading...</h1>
  }
  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="sidebar-container">
        <h1 className="title">Orders</h1>
        <div className="table-container">
          <Table className="table">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Product ID</Th>
                <Th>User ID</Th>
                <Th>Purchased At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.length > 0 &&
                orders.map((order) => {
                  return (
                    <Tr key={order._id}>
                      <Td>{order._id}</Td>
                      <Td>{order.buyer}</Td>
                      <Td>${order.payment}</Td>
                      <Td>
                        <i
                          className="fa fa-window-close action-icons"
                          //onClick={() => dispatch(removeOrder({ orderId: order._id }))}
                        ></i>
                      </Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Orders
