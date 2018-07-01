const {success, fail, error} = require('../utils/Reply')
const db = require('../db/Postgresql')

const SAVE = 'INSERT INTO recipes (id, xml) VALUES ($1, $2)'
const GET = 'SELECT xml FROM recipes WHERE id = $1'

function saveRecipe(req, res) {
  console.log('[Recipe.saveRecipe]', req.body)
  let {receta, id} = req.body

  if (!receta.length || receta.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }
  if (!id.length || id.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }

  db.query(SAVE, [id, receta]).then(result => {
    console.log('[Recipe.saveRecipe] Receta guardada.')
    success(res, 'Ok.')
  }).catch(e => {
    console.error('[ERROR][Recipe.saveRecipe] ' + e.code + '::' + e.detail)
    if (e.code === '23505') {
      return fail(res, 'El id especificado ya existe')
    }
    error(res, 'Error Interno ' + e.code)
  })
}

function getRecipe(req, res) {
  let id = req.params.id
  console.log('[Recipe.getRecipe]', id)

  if (!id || id.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }

  db.query(GET, [id]).then(result => {
    if (result.rows.length === 0) {
      return fail(res, 'Receta not found', 404)
    }
    success(res, {
      receta: result.rows[0].xml
    })
  }).catch(e => {
    console.error('[ERROR][Recipe.saveRecipe] ' + e.code + '::' + e.detail)
    error(res, 'Error Interno ' + e.code)
  })
}

module.exports = {
  saveRecipe, getRecipe
}
