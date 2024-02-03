import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { login } from '../redux/slices/users/userSlice'

import '../styles/login.scss'

const Login = ({ pathName }: { pathName: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { userData } = useSelector((state: RootState) => state.users)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (userData) {
      userData.isAdmin
        ? navigate(pathName ? pathName : '/dashboard/admin/profile')
        : navigate(pathName ? pathName : '/dashboard/user/profile')
    }
  }, [userData, navigate, pathName])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      if (formData.email === '' || formData.password === '') {
        toast.error('You have to enter data')
        return
      } else {
        const res = await dispatch(login(formData))
        if (res.meta.requestStatus === 'rejected') {
          toast.error(res.payload.message)
        } else if (res.meta.requestStatus === 'fulfilled') {
          toast.success(res.payload.message)
        }
      }
    } catch (error) {
      throw new Error('login failed')
    }

    // Reset form fields
    setFormData({
      email: '',
      password: ''
    })
  }

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <label>
          Email :
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password :
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <h4>
          Forget password?{' '}
          <Link to="/forgetPassword" className="forget-button">
            click here
          </Link>
        </h4>
        <br />
        <button className="form-button" type="submit">
          Log in
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login
