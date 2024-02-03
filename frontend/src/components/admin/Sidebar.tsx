import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState } from '../../redux/store'

import '../../styles/sidebar.scss'

const AdminSidebar = () => {
  const baseURL = import.meta.env.VITE_APP_BASE_URL

  const { userData } = useSelector((state: RootState) => state.users)

  return (
    <aside className="sidebar-body">
      <nav className="menu">
        <ul>
          <Link className="span" to={`/dashboard/${userData?.isAdmin ? 'admin' : 'user'}/profile`}>
            <header className="avatar">
              <img src={`${baseURL}/${userData?.image}`} alt="Avatar" />
              <h2>{userData?.name}</h2>
              <h4>{userData?.isAdmin ? 'Admin' : 'user'}</h4>
            </header>
          </Link>

          {userData?.isAdmin ? (
            <>
              <Link className="span" to="/dashboard/admin/products">
                <li className="icon-products">Products</li>
              </Link>
              <Link className="span" to="/dashboard/admin/categories">
                <li className="icon-categories">Categories</li>
              </Link>
              <Link className="span" to="/dashboard/admin/userslist">
                <li className="icon-users">Users</li>
              </Link>
              <Link className="span" to="/dashboard/admin/orders">
                <li className="icon-orders">Orders</li>
              </Link>
            </>
          ) : (
            <Link className="span" to="/dashboard/user/orders">
              <li className="icon-orders">Orders</li>
            </Link>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar
