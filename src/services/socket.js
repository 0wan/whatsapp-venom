const { Server } = require('socket.io');

class Socket {
    io

    constructor(srv) {
        this.io = new Server(srv)
        this.setHandler()
    }

    setHandler() {
        this.io.on('connection', (sock) => {
            console.log('a user conn')
        })
    }
}

exports.Socket = Socket