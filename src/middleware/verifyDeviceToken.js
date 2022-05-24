const Device = require('../repositories/device.repository')

function VerifyDeviceToken(req, res, next) {
    const key = req.params['token']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no device was present' })
    }
    const instance = Device.findBy({ token: key })
    if (!instance) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid token supplied' })
    }
    next()
}

module.exports = VerifyDeviceToken
