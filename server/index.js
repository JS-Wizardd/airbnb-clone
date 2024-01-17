import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import User from './models/User.js'
import Place from './models/Place.js'
import Booking from './models/Booking.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import imageDownloader from 'image-downloader'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())

const bcryptSalt = bcrypt.genSaltSync(10)

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

mongoose.connect(process.env.MONGO_URL)

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    })

    res.json(userDoc)
  } catch (error) {
    res.status(422).json(error)
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password)
    if (passOk) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
        },
        process.env.TOKEN_KEY,
        { expiresIn: 3 * 24 * 60 * 60 }
      )
      res.cookie('token', token).json(user)
    } else {
      res.status(422).json('pass not ok')
    }
  } else {
    res.json('Not found')
  }
})

app.get('/profile', (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        throw err
      } else {
        const { name, email, _id } = await User.findById(data.id)
        res.json({ name, email, _id })
      }
    })
  } else {
    res.json(null)
  }
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body
  const newName = 'photo' + Date.now() + '.jpg'
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  })
  // console.log(newName)
  res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads' })

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]

    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace('uploads\\', ''))
  }
  res.json(uploadedFiles)
})

app.post('/places', async (req, res) => {
  const { token } = req.cookies
  const {
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
  } = req.body

  try {
    const userData = await jwt.verify(token, process.env.TOKEN_KEY)
    await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    })

    // Send a successful response to the frontend
    res.status(200).json({ message: 'Place added successfully', status: true })
  } catch (err) {
    console.error(err)
    // Handle errors and send an error response
    res.status(500).json({ error: 'An error occurred', status: false })
  }
})

app.get('/user-places', (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, process.env.TOKEN_KEY, async (err, userData) => {
    const { id } = userData
    res.json(await Place.find({ owner: id }))
  })
})

app.get('/places/:id', async (req, res) => {
  const { id } = req.params
  const response = await Place.findById(id)
  // console.log(response)
  res.json(response)
})

app.put('/places', async (req, res) => {
  const { token } = req.cookies
  const {
    id,
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
  } = req.body

  jwt.verify(token, process.env.TOKEN_KEY, async (err, userData) => {
    const placeDoc = await Place.findById(id)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      })
      await placeDoc.save()
      res.json({ message: 'Place added successfully', status: true })
    }
  })
})

app.get('/places', async (req, res) => {
  res.json(await Place.find())
})

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req)
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body

  Booking.create({
    place,
    user: userData.id,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
  })
    .then((doc) => {
      res.json(doc)
    })
    .catch((err) => {
      throw err
    })
})

const getUserDataFromToken = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.TOKEN_KEY,
      async (err, userData) => {
        if (err) throw err
        resolve(userData)
      }
    )
  })
}

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req)
  res.json(await Booking.find({ user: userData.id }).populate('place'))
})

app.listen(4000, () => {
  console.log('server is listening to port 4000')
})
