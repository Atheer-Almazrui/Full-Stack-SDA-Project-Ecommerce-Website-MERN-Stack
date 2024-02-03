import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from './redux/store'
import { fetchUsers } from './redux/slices/users/userSlice'
import { fetchProducts } from './redux/slices/products/productSlice'
import { fetchCategories } from './redux/slices/categories/categorySlice'
import { fetchOrders } from './redux/slices/orders/orderSlice'

import Index from './routes/Index'
import '@fortawesome/fontawesome-free/css/all.css'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts())
    // dispatch(fetchUsers())
    dispatch(fetchCategories())
    dispatch(fetchOrders())
  }, [])

  return (
    <div>
      <Index />
    </div>
  )
}

export default App
