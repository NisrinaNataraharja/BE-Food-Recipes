/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { findByEmail, create } = require('../models/user')
const {response, hashPassword} = require('../helper/common')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const authHelper = require('../helper/auth')
const { sendEmail } = require('../helper/mail')
const cloudinary = require('../config/cloudinary')
const errorServ = new createError.InternalServerError()


exports.register = async (req, res, next) =>{
  try {
    const {name, email, phone, password} = req.body
    const {rowCount} = await findByEmail(email)
    if (rowCount) {
      return next(createError(403, 'user already registered'))
    }
    console.log(password);
    const data = {
      id: uuidv4(), 
      name, 
      email, 
      phone,
      password: await hashPassword(password),  
  
    }

    create(data)
    // sendEmail(email)
    response(res, data.email, 201, 'user successfullyy register')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

exports.login = async (req, res, next) =>{
  try {
    const {email, password} = req.body
  const {rows:[user]} = await findByEmail(email)
 if (!user) {
   return response(res, null, 401, 'wrong email or password')
 }
 const validPassword = await bcrypt.compare(password, user.password) ;
 if (!validPassword) {
   return response(res, null, 403, 'wrong email or password')
 }
 delete user.password

const payload ={
  email: user.email,
  id: user.id,
  role: user.role
} 
 //generate token
user.token = authHelper.generateToken(payload)
user.refreshToken = authHelper.gerateRefreshToken(payload)

 response(res, user, 201, 'login success')

  } catch (error) {
    console.log(error);
    next(errorServ)
  }
} 

exports.profile = async(req, res, next)=>{
  let token = req.headers.authorization.split(' ')[1];
  let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
  const email = decoded.email
  const {rows: [user]} = await findByEmail(email)
  delete user.password
  response(res, user, 200)
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.id
    userModel.deleteUser(id)
      .then(() => {
        response(res, null, 203, 'delete user success')
     
      })
      .catch((error) => {
        console.log(error)
        next(new createError.InternalServerError())
      })
  }

exports.refreshToken = (req, res, next)=>{
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
  const payload = {
    email: decoded.email,
    role: decoded.role
  }
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.gerateRefreshToken(payload)
  }
  response(res, result, 200)
} 

exports.updateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    // console.log(decoded.id);
    const id = decoded.id
    const { name, email, phone } = req.body
    let image 
    console.log(req.files.image);
    if (req.files.image) {
      image = req.files.image[0].path
      // const [avatarImage] = req.files.avatar
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, { folder: 'recipe/avatar' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      image = url
    }
    // if (req.files.image) {
    //   image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
    // }
    const data = {
      id,
      name, 
      email, 
      phone, 
      avatar: image
    }
    console.log(data);
    console.log(image);
    await userModel.updateUser(data)
    response(res, data, 202, 'update user success')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }

}


exports.selectUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const result = await userModel.selectUser({ offset, limit })

    // paginatino
    const { rows: [count] } = await userModel.countUser()
    const totalData = parseInt(count.total)
    const totalPage = Math.ceil(totalData / limit)
    const pagination = {
      currentPage: page,
      limit,
      totalData,
      totalPage
    }
    
   response(res, result.rows, 200, 'get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}



