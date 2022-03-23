function VerifySocketKeyToken(socket, next) {
    const key = socket.handshake.auth.key
    if (!key) {
        return next(
            new Error('key not available')
        )
    }
    const instance = WhatsApps[key]
    if (!instance) {
        return next(
            new Error('instance not available')
        )
    }
    next()
}

module.exports = VerifySocketKeyToken
