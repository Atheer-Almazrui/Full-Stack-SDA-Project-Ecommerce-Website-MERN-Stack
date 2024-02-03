import { ChangeEvent, FormEvent, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../redux/store'
import { forgetPassword } from '../redux/slices/users/userSlice'

import '../styles/login.scss'

const ForgetPassword = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setEmail(value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (email == '') {
        toast.error('You have to enter your email')
        return
      } else {
        const res = dispatch(forgetPassword(email))
        if ((await res).meta.requestStatus === 'rejected') {
          toast.error((await res).payload.message)
        } else if ((await res).meta.arg) {
          toast.warn((await res).payload.message)
        }
      }
    } catch (error) {
      throw new Error('Reset password failed')
    }
    setEmail('')
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
      <p style={{ color: 'white' }}>To rest your Password, please write your email here :</p>
      <h2>
        Email :
        <input
          className="form-input"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </h2>
      <button className="form-button" type="submit">
        send reset email
      </button>
      <ToastContainer />
    </form>
  )
}

export default ForgetPassword
