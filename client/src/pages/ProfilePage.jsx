import { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import PlacePage from './PlacesPage'
import AccountNav from '../AccountNav'

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null)
  const { user, ready, setUser } = useContext(UserContext)
  let { subpage } = useParams()
  const navigate = useNavigate()

  async function logout() {
    await axios.post('/logout')
    setUser(null)
    setRedirect('/')
  }

  if (!ready) {
    return 'Loading...'
  }

  if (ready && !user && !redirect) {
    return navigate('/login')
  }

  if (subpage === undefined) {
    subpage = 'profile'
  }

  // console.log(subpage)

  if (redirect) {
    return navigate(redirect)
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto mb-8">
          Logged in as {user.name} ({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === 'places' && <PlacePage />}
    </div>
  )
}
export default ProfilePage
