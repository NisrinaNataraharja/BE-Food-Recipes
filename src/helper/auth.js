/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: '2h',
    // issuer: 'tokoku'
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
  return token
}

const gerateRefreshToken =(payload)=>{
    const verifyOpts = {
      expiresIn: '1 day'
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
    return token
  }

module.exports = { generateToken, gerateRefreshToken }