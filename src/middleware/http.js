const APIExceptionHandler = require('../exceptions/api')

const ServerError = (err, req, res, next) => {
    const statusCode = err.statusCode ? err.statusCode : 500

    res.setHeader('Content-Type', 'application/json')
    res.status(statusCode)
    res.json({
        error: true,
        code: statusCode,
        message: err.message,
    })
}

exports.ServerError = ServerError

exports.APINotFound = (req, res, next) => {
    const err = new APIExceptionHandler({
        message: 'Not Found',
        status: 404
    })

    return ServerError(err, req, res)
}