import DropIn from 'braintree-web-drop-in-react'
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { Product } from '../../redux/slices/products/productSlice'

import '../../styles/cart.scss'
import { fetchBraintreeToken, payWithBraintree } from '../../redux/slices/orders/orderSlice'

const Payment = ({ cartItems, amount }: { cartItems: Product[]; amount: number }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [braintreeClientToken, setBraintreeClientToken] = useState(null)
  const [instance, setInstance] = useState()
  const getBraintreeClientToken = async () => {
    try {
      const response = await dispatch(fetchBraintreeToken())
      setBraintreeClientToken(response.payload.clientToken)
      console.log(braintreeClientToken)
    } catch (error) {
      throw new Error('failed to get Braintree Token')
    }
  }
  // const handlePayment = async () => {
  //   try {
  //     const { nonce } = await instance.requestPaymentMethod()
  //     const response = await dispatch(payWithBraintree({ nonce, cartItems, amount }))
  //     console.log('nonce: ' + nonce)
  //   } catch (error) {
  //     throw new Error('failed to handle Payment')
  //   }
  // }
  useEffect(() => {
    getBraintreeClientToken()
  }, [])
  console.log(braintreeClientToken)
  return (
    <>
      <div>
        <h2>Payment Details</h2>
        <div>
          {braintreeClientToken ? (
            <DropIn
              options={{
                authorization: braintreeClientToken
              }}
              onInstance={(instance) => setInstance(instance)}
            />
          ) : (
            <div>is Loading</div>
          )}
        </div>
      </div>
      {/* <button onClick={handlePayment}>Buy</button> */}
    </>
  )
}

export default Payment
