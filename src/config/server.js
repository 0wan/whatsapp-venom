const express = require('express')
const path = require('path')
const exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const app = express()
const http = require('http');
const middleware = require('../middleware/http')
const routes = require('../routes/')
const io = require('../services/socket')

app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

global.WhatsApps = {}

app.use('/', routes)
app.use(middleware.ServerError)

const server = http.createServer(app);
global.Socket = new io.Server(server)

module.exports = server