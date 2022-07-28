/* eslint-disable no-undef */
require('dotenv').config()

const express = require('express')
const helmet = require("helmet")
const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan')
const mainRoute = require('./src/routes')
const xss = require('xss-clean')
const path = require('path')
const cookieParser = require('cookie-parser')


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 200
}))
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('dev'))
app.use(xss())
app.use(cookieParser())

//
app.use('/v1', mainRoute)

app.use('/image', express.static(path.join(__dirname, '/upload/image')))
app.use('/video', express.static(path.join(__dirname, '/upload/video')))
app.all('*', (req, res, next) => {

  next(new createError.NotFound())


})

// app.use('/image', express.static(path.join(__dirname, '/upload')))
// app.all('*', (req, res, next) => {
//   next(new createError.NotFound())
// })


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const messError = err.message || 'Internal Server Error'
  const statusCode = err.status || 500
  
  res.status(statusCode).json({
    message: messError
  })
})

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`)
})

