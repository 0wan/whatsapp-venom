function VerifyKeyToken(req, res, next) {
    const key = req.query['key']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no key query was present' })
    }
    const instance = WhatsApps[key]
    if (!instance) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid key supplied' })
    }
    next()
}

module.exports = VerifyKeyToken
