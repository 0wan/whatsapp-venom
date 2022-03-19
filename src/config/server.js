const express = require('express')
const path = require('path')
const exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const app = express()
const http = require('../middleware/http')
const routes = require('../routes/')

app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

global.WhatsApps = {}

app.use('/', routes)
app.use(http.ServerError)

module.exports = app