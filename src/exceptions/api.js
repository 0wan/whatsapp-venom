const ExceptionHandler = require('./handler')

class APIExceptionHandler extends ExceptionHandler {
    constructor({ message, errors, status = 500 }) {
        super({
            message,
            errors,
            status,
        })
    }
}

module.exports = APIExceptionHandler