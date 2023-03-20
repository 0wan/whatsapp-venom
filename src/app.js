const dotenv = require('dotenv')
const mongoose = require('mongoose')
const logger = require('pino')()
dotenv.config()

const app = require('./config/server')
const config = require('./config/config')
const { Whatsapp } = require('./services/whatsapp')

let server

// mongoose.set('strictQuery', false)
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//     logger.info(`Database Connected`)
// }).catch((err) => unexpectedErrorHandler(err))

server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
    logger.info(`Starting session ${config.sessionName}`)
    global.WhatsApps = new Whatsapp(config.sessionName)

    WhatsApps.init().then(() => {
        logger.info(`Session ${config.sessionName} started.`)
    })
})

// server.on('listening', async () => {
//     logger.info(`Starting session ${config.sessionName}`)
//     WhatsApps[config.sessionName] = new Whatsapp(config.sessionName)
//
//     await WhatsApps[config.sessionName].init()
// })

const exitClients = () => {
    // const clients = Object.keys(WhatsApps)
    // clients.map((c) => {
    //     const client = WhatsApps[c]
    //     client.close()
    // })
    if (WhatsApps) {
        WhatsApps.close()
    }
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
    exitClients()
    if (server) {
        server.close()
    }
})

process.on('SIGINT', () => {
    exitClients()
    if (server) {
        server.close()
    }
})

module.exports = app