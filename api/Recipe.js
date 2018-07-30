const {success, fail, error} = require('../utils/Reply')
const db = require('../db/Postgresql')
const {sign} = require('../lib/SignService')

const SAVE = 'INSERT INTO recipes (id, xml) VALUES ($1, $2)'
const GET = 'SELECT xml FROM recipes WHERE id = $1'

function saveRecipe(req, res) {
  console.log('[Recipe.saveRecipe]')
  let {receta, id, credentials} = req.body

  if (!receta || receta.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }
  if (!id || id.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }
  if (!credentials) {
    return fail(res, 'Parameter missing or invalid')
  }

  sign(receta, credentials).then(result => {
    if (result.code === 'OK') {
      return db.query(SAVE, [id, result.document])
    } else {
      error(res, result.message)
    }
  }).then(result => {
    console.log('[Recipe.saveRecipe] Receta guardada.')
    success(res, 'Ok.')
  }).catch(e => {
    console.log('[ERROR][Recipe.saveRecipe]', e)
    if (e.code && e.code === '23505') {
      return fail(res, 'El id especificado ya existe')
    }
    error(res, e.message ? e.message : 'Error Interno')
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
    console.error('[ERROR][Recipe.getRecipe] ' + e.code + '::' + e.detail)
    error(res, 'Error Interno ' + e.code)
  })
}

module.exports = {
  saveRecipe, getRecipe
}
