const express = require('express')
const router = express.Router()
const controller = require('../controllers/instance.controller')
const keyToken = require('../middleware/verifyKeyToken')

router.route('/init').get(controller.init)
router.route('/qr').get(keyToken, controller.qr)
router.route('/info').get(keyToken, controller.info)

module.exports = router