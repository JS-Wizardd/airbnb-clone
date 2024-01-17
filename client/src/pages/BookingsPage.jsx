import { useEffect, useState } from 'react'
import AccountNav from '../AccountNav'
import axios from 'axios'
import PlaceImg from '../PlaceImg'
import { differenceInCalendarDays, format } from 'date-fns'
import { Link } from 'react-router-dom'

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  useEffect(() => {
    axios.get('/bookings').then((response) => {
      setBookings(response.data)
    })
  }, [])
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking, i) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              key={i}
              className="flex gap-4 mt-8 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow">
                <h1 className="text-xl">{booking.place.title}</h1>
                <div className="border-t border-gray-300 mt-2 py-2">
                  {format(new Date(booking.checkIn), 'yyyy-MM-dd')}
                  &rarr;
                  {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                </div>
                <div className="text-xl">
                  {differenceInCalendarDays(
                    new Date(booking.checkOut),
                    new Date(booking.checkIn)
                  )}{' '}
                  nights | Total price: ${booking.price}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
export default BookingsPage
