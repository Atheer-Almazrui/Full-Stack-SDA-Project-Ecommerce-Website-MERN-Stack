import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../redux/store'
import { removeAllItem, removeItem } from '../redux/slices/cart/cartSlice'

import './../styles/cart.scss'
import Payment from '../components/user/Payment'

const Cart = () => {
  const baseURL = import.meta.env.VITE_APP_BASE_URL
  const dispatch = useDispatch<AppDispatch>()

  const { cartItems } = useSelector((state: RootState) => state.cart)
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.users)

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.price), 0)

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      <div className="cart-page">
        <div className="card">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={`${baseURL}/${item?.image}`}
                    alt={item.name}
                    className="product-image"
                  />
                  <span className="product-name">{item.name}</span>
                  <span className="product-price">${item.price}</span>
                  <i
                    className="fa fa-window-close action-icons-cart"
                    onClick={() => dispatch(removeItem({ itemId: item._id }))}></i>
                </div>
              ))}
              <div className="total-price">Total: ${totalPrice}</div>
              <button className="remove-btn" onClick={() => dispatch(removeAllItem())}>
                Remove All items
              </button>
            </>
          ) : (
            <h2>No items in the cart.</h2>
          )}
        </div>
        {cartItems.length > 0 && isLoggedIn ? (
          <Payment cartItems={cartItems} amount={totalPrice} />
        ) : (
          <h2>Please Login or Add items to the cart to complate the Payment 🛒</h2>
        )}
      </div>
    </div>
  )
}

export default Cart
