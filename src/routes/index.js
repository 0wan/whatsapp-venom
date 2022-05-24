const express = require('express')
const router = express.Router()
const config = require('../config/app')
const instance = require('./instance')
const message = require('./message')
const chat = require('./chat')
const device = require('./device')

router.get('/', (req, res) => {
    // res.render('pages/app', { token: config.sessionName })
    res.redirect('/device')
})
router.get('/status', (req, res) => res.send('OK'))

router.use('/instance', instance)
router.use('/message', message)
router.use('/chat', chat)
router.use('/device', device)

module.exports = router