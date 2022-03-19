const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')
const keyToken = require('../middleware/verifyKeyToken')
const clientAvailable = require('../middleware/verifyClientAvailable')

router.route('/all').get(keyToken, clientAvailable, controller.getAll)

module.exports = router