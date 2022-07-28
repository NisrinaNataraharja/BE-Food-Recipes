const pool = require('../config/db')

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM "user" WHERE email = $1', [email], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}


const create = ({id, name, email, phone, password, avatar}) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO "user" (id, name, email, phone, password, avatar)VALUES($1, $2, $3, $4, $5, $6)', [id, name, email, phone, password, avatar] , (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const updateUser = ({ id, name, email, phone, avatar }) => {
  return pool.query(`UPDATE "user" SET  
  name = COALESCE($1, name),
  email = COALESCE($2, email),
  phone = COALESCE($3, phone), 
  avatar = COALESCE($4, avatar) WHERE id = $5;`, [name, email, phone, avatar, id])
}

const selectUser = ({ limit, offset }) => {
    return pool.query('SELECT * FROM "user" LIMIT $1 OFFSET $2', [limit, offset])
  }
  
  
  const deleteUser = (id) => {
    return pool.query('DELETE FROM "user" WHERE id = $1', [id])
  }
  
  const countUser = () => {
    return pool.query('SELECT COUNT(*) AS total FROM "user"')
  }
  
  module.exports = {
    findByEmail,
    create,
    selectUser,
    // insertUser,
    updateUser,
    deleteUser,
    countUser
  }

 