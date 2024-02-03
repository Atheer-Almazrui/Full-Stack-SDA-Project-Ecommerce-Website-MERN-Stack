import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Activate from '../pages/Activate'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import ForgetPassword from '../pages/ForgetPassword'
import ResetPassword from '../pages/ResetPassword'

import Header from '../components/Header'
import Products from '../components/admin/Products'
import AdminProfile from '../components/admin/AdminProfile'
import Categories from '../components/admin/Categories'
import UsersList from '../components/admin/UsersList'
import Orders from '../components/admin/Orders'
import UserProfile from '../components/user/UserProfile'
import Footer from '../components/Footer'

import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

const Index = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login pathName={''} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/users/activate/:token" element={<Activate />} />
        <Route path="/users/resetPassword/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route path="user/profile" element={<UserProfile />} />
          {/* <Route path="user/orders" element={<UserOrders />} /> */}
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="admin/categories" element={<Categories />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/userslist" element={<UsersList />} />
          <Route path="admin/orders" element={<Orders />} />
        </Route>
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default Index
