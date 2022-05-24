const mongoose = require('mongoose')
const logger = require('pino')()

const app = require('./config/server')
const config = require('./config/app')
const {Whatsapp} = require("./services/whatsapp");

let server
let db

mongoose.connect(config.mongoose.url, config.mongoose.options)
db = mongoose.connection
db.on('error', (err) => unexpectedErrorHandler(err))
db.once('open', () => logger.info(`Database Connected`))

server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
})

server.on('listening', async () => {
    // logger.info(`Starting session ${config.sessionName}`)
    // WhatsApps[config.sessionName] = new Whatsapp(config.sessionName)
    //
    // await WhatsApps[config.sessionName].init()
})

const exitClients = () => {
    const clients = Object.keys(WhatsApps)
    clients.map((c) => {
        const client = WhatsApps[c]
        client.close()
    })
}

const exitHandler = () => {
    exitClients()
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    exitClients()
    if (server) {
        server.close()
    }
})

module.exports = app