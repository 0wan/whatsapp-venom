const express = require('express')
const router = express.Router()
const controller = require('../controllers/message.controller')
const keyToken = require('../middleware/verifyKeyToken')
const clientAvailable = require('../middleware/verifyClientAvailable')

router.route('/all').get(keyToken, clientAvailable, controller.all)
router.route('/text').post(keyToken, clientAvailable, controller.text)
router.route('/list').post(keyToken, clientAvailable, controller.list)
router.route('/button').post(keyToken, clientAvailable, controller.button)
router.route('/file').post(keyToken, clientAvailable, controller.file)
router.route('/image').post(keyToken, clientAvailable, controller.image)
router.route('/sticker').post(keyToken, clientAvailable, controller.sticker)
router.route('/voice').post(keyToken, clientAvailable, controller.voice)
router.route('/link').post(keyToken, clientAvailable, controller.link)
router.route('/reply').post(keyToken, clientAvailable, controller.reply)

module.exports = router