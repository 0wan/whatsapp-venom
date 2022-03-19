function VerifyClientAvailable(req, res, next) {
    const key = req.query['key']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no key query was present' })
    }
    const instance = WhatsApps[key]
    if (['isLogged', 'chatsAvailable', 'qrReadSuccess'].includes(instance.instance.status) !== true ) {
        return res
            .status(403)
            .send({ error: true, message: 'client chat not available' })
    }
    next()
}

module.exports = VerifyClientAvailable
