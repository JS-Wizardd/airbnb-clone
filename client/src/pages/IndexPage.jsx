import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const IndexPage = () => {
  const [places, setPlaces] = useState([])

  useEffect(() => {
    axios.get('/places').then((response) => {
      setPlaces(response.data)
    })
  }, [])
  return (
    <div className="mt-16 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      {places.length > 0 &&
        places.map((place, index) => (
          <Link to={'/place/' + place._id} key={index} className="">
            <div className="bg-red-500 mb-2 rounded-2xl flex overflow-hidden ">
              {place.photos?.[0] && (
                <img
                  className=" object-cover aspect-square "
                  src={'http://localhost:4000/uploads/' + place.photos?.[0]}
                  alt="image"
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500 truncate leading-4">
              {place.title}
            </h3>
            <div className="mt-1">
              <span className="font-bold">${place.price} </span>
              per night
            </div>
          </Link>
        ))}
    </div>
  )
}
export default IndexPage
