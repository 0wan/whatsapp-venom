const express = require('express')
const router = express.Router()
const controller = require('../controllers/device.controller')

router.route('/').get(controller.index)
router.route('/create').get(controller.create)
router.route('/create').post(controller.store)
router.route('/:token').get(controller.show)
router.route('/:token/status').get(controller.status)
router.route('/:token/destroy').get(controller.destroy)

module.exports = router