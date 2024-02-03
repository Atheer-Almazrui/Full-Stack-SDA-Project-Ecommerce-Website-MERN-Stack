import { ChangeEvent, FormEvent, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { addUser } from '../redux/slices/users/userSlice'

import '../styles/login.scss'

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    phone: '',
    address: ''
    // role: 'user',
    // ban: false
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target

    if (type === 'file') {
      setSelectedImage((event.target as HTMLInputElement).files?.[0] || null)

      const fileInput = (event.target as HTMLInputElement) || ''
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: fileInput.files?.[0]
      }))
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('name', userData.name)
    formData.append('email', userData.email)
    formData.append('image', userData.image)
    formData.append('password', userData.password)
    formData.append('address', userData.address)
    formData.append('phone', userData.phone)

    if (
      userData.name === '' ||
      userData.email === '' ||
      userData.password === '' ||
      userData.phone === ''
    ) {
      toast.error('You have to enter all required feilds')
      return
    } else {
      const res = await addUser(formData)
      res.type === 'success' ? toast.success(res.message) : toast.error(res.message)
    }

    // Reset form fields
    setUserData({
      name: '',
      email: '',
      password: '',
      image: '',
      phone: '',
      address: ''
      // role: 'user',
      // ban: false
    })
    setSelectedImage(null)
  }
  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <br />
        <h1>Sign up</h1>
        <label>
          * Name :
          <input
            className="form-input"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          * Email :
          <input
            className="form-input"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          * Phone :
          <input
            className="form-input"
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Address :
          <input
            className="form-input"
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          * Password :
          <input
            className="form-input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={userData.password}
            onChange={handleChange}
          />
        </label>
        <div className="file-upload">
          <input
            type="file"
            id="upload"
            name="image"
            accept="image/*"
            className="file-upload__input"
            onChange={handleChange}
          />
          <label htmlFor="upload" className="file-upload__label">
            {selectedImage ? selectedImage.name : 'Choose image'}
          </label>
        </div>
        <br />
        <button className="form-button" type="submit">
          Sign up
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup
