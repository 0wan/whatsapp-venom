const { Server: SocketServer } = require('socket.io');
const logger = require('pino')()
const middleware = require('../middleware/verifySocketKeyToken')

class Server {
    socket
    whatsapp

    constructor(app) {
        this.socket = new SocketServer(app)
        this.socket.use(middleware)
        this.setHandler()
    }

    setHandler() {
        const that = this
        this.socket.on('connection', (sock) => {
            console.log('a user conn', sock)
            that.whatsapp = WhatsApps[sock.handshake.auth.key]

            if ( [
                'notLogged',
                'qrReadFail',
            ].includes(that.whatsapp.instance.status)  )
            {
                that.whatsapp.restartService()
            }
            else
            {
                that.sendAllChats().catch()
            }
        })

        // this.socket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });

        this.socket.on('ws:chat:all', (data) => {
            that.sendAllChats().catch(e => logger.info(e))
        })

        this.socket.on('ws:message:all', (data) => {
            logger.info('ws:message:all')
            logger.info(data)
            that.sendAllMessages(data.phone).catch(e => logger.info(e))
        })
    }

    async sendAllChats() {
        const result = await this.whatsapp?.getAllChats()
        this.socket.emit('wa:chat:all', {data: result})
    }

    async sendAllMessages(to) {
        const result = await this.whatsapp?.getAllMessages(to)
        this.socket.emit('wa:message:all', {data: result})
    }
}

exports.Server = Server