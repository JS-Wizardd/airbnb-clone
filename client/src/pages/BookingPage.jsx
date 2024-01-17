import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddressLink from '../AddressLink'
import PlaceGallery from '../PlaceGallery'
import { differenceInCalendarDays, format } from 'date-fns'
const BookingPage = () => {
  const [booking, setBooking] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id)
        if (foundBooking) {
          setBooking(foundBooking)
        }
      })
    }
  }, [id])

  if (!booking) {
    return ''
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-4 mb-4 flex rounded-2xl">
        <div className="text-md flex-grow">
          Your booking information : &nbsp;{'   '}
          <div className=" border-gray-300 mt-2 text-xl font-semibold ">
            {format(new Date(booking.checkIn), 'yyyy-MM-dd')}
            &nbsp; &rarr; &nbsp;{' '}
            {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
          </div>{' '}
          <div className="text-xl font-bold">
            {differenceInCalendarDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            )}{' '}
            nights
          </div>
        </div>
        <div className="text-2xl flex-shrink-0 mr-4 bg-primary p-4 text-white rounded-2xl">
          Total price:
          <br /> <span className="font-bold"> ${booking.price}</span>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  )
}
export default BookingPage
