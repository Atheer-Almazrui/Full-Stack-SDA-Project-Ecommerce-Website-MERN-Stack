import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode, { JwtDecodeOptions, JwtPayload } from 'jwt-decode'
import { AxiosError } from 'axios'

import '../styles/cart.scss'
import '../styles/login.scss'
import { activateUser } from '../redux/slices/users/userSlice'

const Activate = () => {
  const { token } = useParams()
  const decoded = jwtDecode(String(token)) as { name: string }
  const navigate = useNavigate()

  const handleActivate = async () => {
    try {
      const res = await activateUser(String(token))
      toast.success(res)
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }
  return (
    <div style={{ padding: '4em' }}>
      <h1>Activatation</h1>
      <h3 style={{ color: 'white' }}>Hello {decoded.name}!</h3>
      <p style={{ color: 'white' }}>To Activate your account click here:</p>
      <button style={{ padding: '0.5em' }} onClick={handleActivate}>
        Activate
      </button>
      <ToastContainer />
    </div>
  )
}

export default Activate
