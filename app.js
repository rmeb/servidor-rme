const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const package = require('./package.json')

const Recipe = require('./api/Recipe')
const ESign = require('./api/ESign')

console.log('Server init.')
app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => res.send({
    "name": package.name,
    "version": package.version
}))

app.post('/receta', Recipe.saveRecipe)
app.get('/receta/:id', Recipe.getRecipe)
app.post('/esign', ESign.checkPassword)

var port = process.env.PORT || 4000
app.listen(port, () => console.log(package.name + '-' + package.version + ' listening on port ' + port))
