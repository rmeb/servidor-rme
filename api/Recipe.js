const {success, fail, error} = require('../utils/Reply')

function saveRecipe(req, res) {
  console.log('[Recipe.saveRecipe]', req.body)
  let {receta, id} = req.body

  if (!receta.length || receta.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }
  if (!id.length || id.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }

  let data = {
    receta, id
  }

  success(res, 'Ok.')
}

function getRecipe(req, res) {
  let id = req.params.id
  console.log('[Recipe.getRecipe]', id)

  if (!id || id.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }

  success(res, {
    receta: '<?xml>'
  })
}

module.exports = {
  saveRecipe, getRecipe
}
