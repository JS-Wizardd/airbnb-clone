import { useEffect, useState } from 'react'
import PhotosUploader from '../PhotosUploader'
import Perks from '../Perks'
import { useNavigate, useParams } from 'react-router-dom'
import AccountNav from '../AccountNav'
import axios from 'axios'

const PlacesFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addedPhotos, setAddedPhotos] = useState([])
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)
  const [price, setPrice] = useState(100)
  const [redirectNow, setRedirectNow] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }
    axios
      .get('/places/' + id)
      .then((response) => {
        const { data } = response
        setTitle(data.title)
        setAddress(data.address)
        setAddedPhotos(data.photos)
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckIn(data.checkIn)
        setCheckOut(data.checkOut)
        setMaxGuests(data.maxGuests)
        setPrice(data.price)
      })
      .catch((err) => console.log(err))
  }, [id])

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>
  }
  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>
  }
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }

  async function savePlace(e) {
    e.preventDefault()
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    }

    if (id) {
      try {
        const response = await axios.put('/places', {
          id,
          ...placeData,
        })
        // console.log(response)
        if (response.data.status) {
          navigate('/account/places')
        } else {
          console.error('Place addition failed!')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await axios.post('/places', placeData)
        // console.log(response)
        if (response.data.status) {
          navigate('/account/places')
        } else {
          console.error('Place addition failed!')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'Title',
          ' Title for your place, should be short and catchy as in advertisement'
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="eg: My Lovely apartment"
        />

        {preInput('Address', 'Address to this place')}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="address"
        />

        {preInput('Photos', 'Add some professional photos')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput('Description', 'Description of the place')}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {preInput('Perks', 'Select all perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput('Extra Info', 'House, rules, etc...')}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />

        {preInput(
          'Check in & out',
          ' add check in and out times, remember to have some time window cleaning the room between guests'
        )}
        <div className="grid  gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="09:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="primary my-6">
          Save
        </button>
      </form>
    </div>
  )
}
export default PlacesFormPage
