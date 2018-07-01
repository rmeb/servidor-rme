const {success, fail, error} = require('../utils/Reply')

function saveRecipe(req, res) {
  console.log(req.body)
  success(res, 'Ok.')
}

function getRecipe(req, res) {
  console.log(req.params.id)
  success(res, {
    receta: ''
  })
}

module.exports = {
  saveRecipe, getRecipe
}
