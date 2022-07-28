const pool = require('../config/db')

const selectRecipeWithCondition = (condition) => {
  //console.log(condition);
  return pool.query(`
  SELECT r.*
  FROM recipes r  
  LEFT JOIN "user" u on r.id_user = u.id
  WHERE r.title ILIKE '%${condition.search}%' 
  GROUP BY r.id, r.title, u.name, r.ingredients, r.image, r.video, r."like", r.create_at
  ORDER BY ${condition.sort} ${condition.order}
  LIMIT ${condition.limit} OFFSET ${condition.offset}
  `)
}
const recipebyId = (id) => {
  return pool.query('SELECT* FROM recipes WHERE id = $1', [id])
}


const recipebyUserId = (id) => {
  return pool.query('SELECT recipes.* FROM recipes INNER JOIN "user" ON recipes.id_user = "user".id  WHERE "user".id = $1',[id])
}

const insertRecipe = ({ id, id_user, ingredients, title, image, video, like, create_at }) => {
  return pool.query('INSERT INTO recipes (id, id_user, ingredients, title, image, video, "like", create_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [id, id_user, ingredients, title, image, video, like, create_at])
}

const updateRecipe = ({ ingredients, title, image, video, like, create_at, id }) => {
  return pool.query(`UPDATE recipes SET  
  ingredients = COALESCE($1, ingredients),
  title = COALESCE($2, title),
  image = COALESCE($3, image), 
  video = COALESCE($4, video), 
  "like" = COALESCE($5, "like"), 
  create_at = COALESCE($6, create_at) WHERE id = $7;`, [ingredients, title, image, video, like, create_at, id])
}

const deleteRecipe = (id) => {
  return pool.query('DELETE FROM recipes WHERE id = $1', [id])
}

const countRecipe = () => {
  return pool.query('SELECT COUNT(*) AS total FROM recipes')
}

module.exports = {
  ///selectProducts,
  selectRecipeWithCondition,
  recipebyId,
  recipebyUserId,
  updateRecipe,
  insertRecipe,
  deleteRecipe,
  countRecipe
}

