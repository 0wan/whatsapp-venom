const { Server: SocketServer } = require('socket.io');
const logger = require('pino')()
const middleware = require('../middleware/verifySocketKeyToken')
const {Whatsapp} = require("./whatsapp");

class Server {
    socket    

    constructor(app) {
        this.socket = new SocketServer(app)
        this.socket.use(middleware)
        this.setHandler()
    }

    setHandler() {        
        this.socket.on('connection', (client) => {            
            let whatsapp = WhatsApps[client.handshake.auth.key]

            if ([
                'initializing',
                'autocloseCalled',
            ].includes(whatsapp.instance.status)) {
                // client.disconnect()
            }

            if ([
                'notLogged',
                'qrReadFail',
            ].includes(whatsapp.instance.status)) {
                logger.info('Restarting whatsapp service...')
                whatsapp.restartService()
            }
            if ([
                'isLogged',
                'qrReadSuccess',
                'chatsAvailable'
            ].includes(whatsapp.instance.status)) {
                try {
                    whatsapp?.getAllChats().then((result) => {
                        this.socket.emit('wa:chat:all', {data: result})
                    })
                } catch (e) {
                }

            }

            client.on('ws:instance:init', async (data) => {
                const token = data.token

                WhatsApps[token] = new Whatsapp(token)
                await WhatsApps[token].init()

                whatsapp = WhatsApps[token]
            })

            client.on('ws:chat:all', (data) => {
                // that.sendAllChats().catch(e => logger.info(e))
                whatsapp.getAllChats().then((result) => {
                    this.socket.emit('wa:chat:all', {data: result})
                })
            })

            client.on('ws:message:all', (data) => {
                logger.info('ws:message:all')
                logger.info(data)
                // that.sendAllMessages(data.phone).catch(e => logger.info(e))
                whatsapp.getAllMessages(data.phone).then((result) => {
                    this.socket.emit('wa:message:all', {data: result})
                })
            })

            client.on('ws:message:more', (data) => {
                logger.info('ws:message:more')
                logger.info(data)
                // that.sendAllMessages(data.phone).catch(e => logger.info(e))
                whatsapp.getMoreMessages(data.phone).then((result) => {
                    this.socket.emit('wa:message:all', {data: result})
                })
            })

            client.on('ws:message:seen', (data) => {
                whatsapp.sendActionSeen(data.phone).then((result) => {
                })
            })

            client.on('ws:send:text', ({to, message}) => {
                whatsapp.sendTextMessage(to, message).then(() => {
                })
            })

        })

        // this.socket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });
    }
}

exports.Server = Server