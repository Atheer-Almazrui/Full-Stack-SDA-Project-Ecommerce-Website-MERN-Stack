import { ToastContainer, toast } from 'react-toastify'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { AppDispatch } from '../redux/store'
import { resetPassword } from '../redux/slices/users/userSlice'

import '../styles/login.scss'

const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { token } = useParams()

  const [password, setPassword] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setPassword(value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (password.length < 6) {
        toast.error('The password must be at least 6 characters')
        return
      } else {
        const res = dispatch(resetPassword({ password: password, token: String(token) }))
        if ((await res).meta.requestStatus === 'rejected') {
          toast.error((await res).payload.message)
        } else if ((await res).meta.arg) {
          toast.success((await res).payload.message)
          setTimeout(() => {
            navigate('/login')
          }, 1500)
        }
      }
    } catch (error) {
      throw new Error('Reset password failed')
    }
    setPassword('')
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
      <p style={{ color: 'white' }}>Write the new password here :</p>
      <h2>
        Password :
        <input
          className="form-input"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </h2>
      <button className="form-button" type="submit">
        Reset Password
      </button>
      <ToastContainer />
    </form>
  )
}

export default ResetPassword
