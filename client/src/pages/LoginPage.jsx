import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        '/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      setUser(data)
      alert('Login successful')
      navigate('/')
    } catch (error) {
      alert('Login Failed')
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-center">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?<span> </span>
            <Link className="underline text-black" to={'/register'}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default LoginPage
