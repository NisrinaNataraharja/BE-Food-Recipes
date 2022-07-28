const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: 'ruirui',
  api_key: '567926859836776',
  api_secret: 'pVmuuNR40pVgmYU7IaUSU13s6P0'
})

module.exports = cloudinary