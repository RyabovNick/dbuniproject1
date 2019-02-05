const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const cors = require('cors')

var app = express()

//cross-origin requests
app.use(cors())
//для возможности парсить входящий JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes'))

//если не найдено
/*app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})*/

app.listen(8447, () => {
    console.log('server listen 8080')
})

module.exports = router
