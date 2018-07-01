const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const package = require('./package.json')

console.log('Server init.')
app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => res.send({
    "name": package.name,
    "version": package.version
}))

var port = process.env.PORT || 4000
app.listen(port, () => console.log(package.name + '-' + package.version + ' listening on port ' + port))
