import { Outlet, useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

import Login from '../pages/Login'

const ProtectedRoute = () => {
  const location = useLocation()
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.users)

  return isLoggedIn && !userData?.isAdmin ? <Outlet /> : <Login pathName={location.pathname} />
}

export default ProtectedRoute
