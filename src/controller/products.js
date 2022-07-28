/* eslint-disable no-undef */
const createError = require('http-errors')
const productsModel = require('../models/products')
const commonHelper = require('../helper/common')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/cloudinary')
const errorServ = new createError.InternalServerError()

exports.selectRecipeWithCondition = async (req, res, next) => {
  try {
    const condition = req.query
    condition.search = condition.search || ''
    condition.page = parseInt(condition.page) || 1
    condition.limit = parseInt(condition.limit) || 5
    condition.offset = (condition.page * condition.limit) - condition.limit
    condition.sort = condition.sort || 'id'
    condition.order = condition.order || 'ASC'
    const result = await productsModel.selectRecipeWithCondition(condition)


    const { rows: [count] } = await productsModel.countRecipe()
    const totalData = parseInt(count.total)
    const totalPage = Math.ceil(totalData / condition.limit)
    const pagination = {
      currentPage: condition.page,
      limit: condition.limit,
      totalData,
      totalPage
    }

    commonHelper.response(res, result.rows, 200, 'get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

exports.getRecipeId = (req, res, next) => {
  const id = req.params.id
  console.log('masuk');
  productsModel
    .recipebyId(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, 'get data by id success')
    })
    .catch((error) => {
      console.log(error)
      next(createError)
    })
}

exports.getRecipeByUserId = (req, res, next) => {
  console.log('tes');
  let token = req.headers.authorization.split(' ')[1];
  let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
  console.log(decoded.id, 'masuk pa eko');
  const id = decoded.id
  productsModel
    .recipebyUserId(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, 'get data by User id success')
    })
    .catch((error) => {
      console.log(error)
      next(createError)
    })
}

exports.insertRecipe = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    // console.log(decoded.id);
    const id = decoded.id

    const { ingredients, title } = req.body
    const id_user = id
    let image
    let video
    if (req.files.image) {
      image = req.files.image[0].path
      // image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, { folder: 'recipe/image' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      image = url
    }
    if (req.files.video) {
      // video = `${process.env.HOST_LOCAL_IMAGE}video/${req.files.video[0].filename}`
      video = req.files.video[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(video, { folder: 'recipe/video', resource_type: 'video' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      video = url
    }
    const data = {
      id: uuidv4(),
      id_user,
      ingredients,
      title,
      image,
      video
    }
    console.log(data);
    await productsModel.insertRecipe(data)
    commonHelper.response(res, data, 201, 'insert data success')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}


exports.updateRecipe = async (req, res, next) => {
  try {
    // console.log(req.files);
    const id = req.params.id
    const { ingredients, title, like } = req.body
    let image
    let video
    if (req.files.image) {
      image = req.files.image[0].path
      // image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, { folder: 'recipe/image' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      image = url
    }
    if (req.files.video) {
      // video = `${process.env.HOST_LOCAL_IMAGE}video/${req.files.video[0].filename}`
      video = req.files.video[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(video, { folder: 'recipe/video', resource_type: 'video' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      video = url
    }
    // if (req.files.image) {
    //   image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
    // }
    // if (req.files.video) {
    //   video = `${process.env.HOST_LOCAL_IMAGE}video/${req.files.video[0].filename}`
    // }
    const data = {
      id,
      ingredients,
      title,
      image,
      video,
      like
    }
    console.log(data);
    await productsModel.updateRecipe(data)
    commonHelper.response(res, data, 202, 'update data success')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }

}

exports.deleteRecipe = (req, res, next) => {
  const id = req.params.id
  productsModel.deleteRecipe(id)
    .then(() => {
      commonHelper.response(res, null, 203, 'delete data success')
    })
    .catch((error) => {
      console.log(error)
      next(new createError.InternalServerError())
    })
}


