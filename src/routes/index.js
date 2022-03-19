const express = require('express')
const router = express.Router()
const instance = require('./instance')
const message = require('./message')
const chat = require('./chat')

router.get('/status', (req, res) => res.send('OK'))

router.use('/instance', instance)
router.use('/message', message)
router.use('/chat', chat)

module.exports = router