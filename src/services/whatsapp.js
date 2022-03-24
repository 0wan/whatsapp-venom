const fs = require('fs')
const path = require('path')
const logger = require('pino')()
const { v4: uuidv4 } = require('uuid')
const mime = require('mime-types');
const QRCode = require('qrcode')
const venom = require('venom-bot');
const config = require('../config/app')
const Message = require('../repositories/message.repository')

class Whatsapp {
    client
    key = ''
    instance = {
        key: this.key,
        qr: '',
        chats: [],
        messages: [],
    }

    constructor(key) {
        this.key = key ? key : uuidv4()
    }

    async init() {
        this.instance.status = `initializing`

        venom
            .create(
                //session
                this.key,
                (base64Qrimg, asciiQR, attempts, urlCode) => {
                    this.instance.qr = base64Qrimg
                    Socket.socket.emit('wa:instance:qr', { qr: base64Qrimg, attempts })
                },
                (statusSession, session) => {
                    // statusSession: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
                    this.instance.status = statusSession
                    //Create session wss return "serverClose" case server for close
                    this.instance.session = session

                    Socket.socket.emit('wa:instance:status', { status: statusSession })
                },
                {
                    multidevice: true,
                    folderNameToken: 'tokens', //folder name when saving `tokens`
                    mkdirFolderToken: path.join(__dirname, '../storage'), //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
                    logQR: false,
                    // browserArgs: [
                    //     '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
                    // ],
                }
            )
            .then((agent) => { this.setHandler(agent) })
            .catch((err) => {
                logger.error(err)
            })

        return this
    }

    setHandler(agent) {
        this.client = agent
        //Listens to all new messages
        //To receiver or recipient
        // Gunakan untuk log pesan masuk dan keluar
        // baiknya disimpan di database
        this.client.onAnyMessage(async (message) => {
            // filter hanya pesan yang diterima/dikirim user
            if (['status@broadcast'].includes(message.from)) return;

            // add custom field
            message.fileStoragePath = null
            message.fileStorageURL = null

            if (message.isMedia === true || message.isMMS === true) {
                const buffer = await this.client?.decryptFile(message);
                // At this point you can do whatever you want with the buffer
                // Most likely you want to write it into a file
                const hash = uuidv4()
                const fileName = path.join(__dirname,`../storage/media/${this.key}-${hash}.${mime.extension(message.mimetype)}`);
                await fs.writeFile(fileName, buffer, (err) => {
                    //
                });
                message.fileStoragePath = fileName
                message.fileStorageURL = fileName.replace(path.join(__dirname,`../storage`), '')                
            }

            // logger.info('onAnyMessage')
            // logger.info(message)
            await Message.create(this.key, message)

            Socket.socket.emit('wa:message:new', {data:message})
        })

        // Listen to messages /  Hanya pesan masuk
        // Gunakan untuk membuat response berdasarkan pesan
        // tidak digunakan untuk simpan ke database
        this.client.onMessage(async (message) => {
            // filter hanya pesan yang diterima/dikirim user
            if (['status@broadcast'].includes(message.from)) return;

            // if (message.isMedia === true || message.isMMS === true) {
            //     const buffer = await this.client?.decryptFile(message);
            //     // At this point you can do whatever you want with the buffer
            //     // Most likely you want to write it into a file
            //     const hash = uuidv4()
            //     const fileName = path.join(__dirname,`../storage/media/${this.key}-${hash}.${mime.extension(message.mimetype)}`);
            //     await fs.writeFile(fileName, buffer, (err) => {
            //         //
            //     });
            // }

            // logger.info('onMessage')
            // logger.info(message)
            // await Message.create(this.key, message)
        })

        // Listen to state changes
        // function to detect conflits and change status
        // Force it to keep the current session
        // Possible state values:
        // CONFLICT
        // CONNECTED
        // DEPRECATED_VERSION
        // OPENING
        // PAIRING
        // PROXYBLOCK
        // SMB_TOS_BLOCK
        // TIMEOUT
        // TOS_BLOCK
        // UNLAUNCHED
        // UNPAIRED
        // UNPAIRED_IDLE
        this.client.onStateChange(state => {
            Socket.socket.emit('wa:instance:state', {state:state})
            // logger.info('State has changed, new state : ')
            // logger.info(state)
            // force whatsapp take over
            if ('CONFLICT'.includes(state)) {
                try {
                    this.client.useHere();
                } catch {}
            }
            // detect disconnect on whatsapp
            // if ('UNPAIRED'.includes(state)) console.log('logout');
        });

        // Listen to ack's
        // See the status of the message when sent.
        // When receiving the confirmation object, "ack" may return a number, look {@link AckType} for details:
        // -7 = MD_DOWNGRADE,
        // -6 = INACTIVE,
        // -5 = CONTENT_UNUPLOADABLE,
        // -4 = CONTENT_TOO_BIG,
        // -3 = CONTENT_GONE,
        // -2 = EXPIRED,
        // -1 = FAILED,
        //  0 = CLOCK,
        //  1 = SENT,
        //  2 = RECEIVED,
        //  3 = READ,
        //  4 = PLAYED =
        this.client.onAck(async (ack) => {
            // {id: { fromMe, remote, id, _serialized}  } , messageId => id._serialized
            // field to update => ack ,
            await Message.ack(this.key, ack.id._serialized, ack.ack).catch(() => { })

            Socket.socket.emit('wa:message:ack', {data:ack})
        });

        // function to detect incoming call
        this.client.onIncomingCall(async (call) => {
            await this.client?.sendText(call.peerJid, "Maaf, Tidak Dapat Menerima Panggilan!");
        });

    }

    async getInstanceDetail(key) {
        return {
            instance_key: key,
            status: this.instance?.status,
            session: this.instance?.session,
        }
    }

    getWhatsAppId(id) {
        if (id.includes('@g.us') || id.includes('@c.us')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@c.us`
    }

    isGroup(id) {
        id = this.getWhatsAppId(id)
        return id.includes('@g.us')
    }

    async verifyId(id) {
        if (this.isGroup(id)) return true
        return this.client?.checkNumberStatus(this.getWhatsAppId(id))
            .then((res) => {
                return true;
            })
            .catch((e) => {
                throw new Error('no account exists')
            });
    }

    // Sending
    
    async sendTextMessage(to, message) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.sendText(this.getWhatsAppId(to), message)
        return data
    }

    async sendListMessage(to, title, subtitle, description, btnText, list) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.sendListMenu(this.getWhatsAppId(to), title, subtitle, description, btnText, list)
        return data
    }

    async sendButtonMessage(to, title, buttons, description) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.sendButtons(this.getWhatsAppId(to), title, buttons, description)
        return data
    }

    async sendFileMessage(to, fileOrBase64, filename, message, isBase64 = true) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await (isBase64)
            ? this.client?.sendFileFromBase64(this.getWhatsAppId(to), fileOrBase64, filename, message)
            : this.client?.sendFile(this.getWhatsAppId(to), fileOrBase64, filename, message)
        return data
    }

    async sendImageMessage(to, image, filename, message, isBase64 = true) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await (isBase64)
            ? this.client?.sendImageFromBase64(this.getWhatsAppId(to), image, filename, message)
            : this.client?.sendImage(this.getWhatsAppId(to), image, filename, message)
        return data
    }

    async sendImageSticker(to, image, isGif = false) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await (isGif)
            ? this.client?.sendImageAsStickerGif(this.getWhatsAppId(to), image)
            : this.client?.sendImageAsSticker(this.getWhatsAppId(to), image)
        return data
    }

    async sendVoiceMessage(to, message, isBase64 = true) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await (isBase64)
            ? this.client?.sendVoiceBase64(this.getWhatsAppId(to), message)
            : this.client?.sendVoice(this.getWhatsAppId(to), message)
        return data
    }

    async sendLinkMessage(to, link, message) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.sendLinkPreview(this.getWhatsAppId(to), link, message)
        return data
    }

    async sendReplyMessage(to, message, fromMessageId) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.sendReplyMessage(this.getWhatsAppId(to), message, fromMessageId)
        return data
    }

    async sendActionSeen(to, check = true) {
        if (check) await this.verifyId(this.getWhatsAppId(to))
        await this.client?.sendSeen(this.getWhatsAppId(to))
    }

    async sendActionTypingStart(to, check = true) {
        if (check) await this.verifyId(this.getWhatsAppId(to))
        await this.client?.startTyping(this.getWhatsAppId(to))
    }

    async sendActionTypingStop(to, check = true) {
        if (check) await this.verifyId(this.getWhatsAppId(to))
        await this.client?.stopTyping(this.getWhatsAppId(to))
    }

    // message

    async getAllMessages(to, includeMe = true, includeNotify = true) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.getAllMessagesInChat(this.getWhatsAppId(to), includeMe, includeNotify)
        return data
    }

    async getOldMessages(to, includeMe = true, includeNotify = true) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.loadAndGetAllMessagesInChat(this.getWhatsAppId(to), includeMe, includeNotify)
        return data
    }

    // Clear chat messages
    // await client.clearChatMessages('000000000000@c.us');

    // Chat -------------------------------------------------------------------------
    async getAllChats() {
        // Retrieve all chats
        return await this.client.getAllChats();
    }

    async hasChat(to) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.client?.checkChat(this.getWhatsAppId(to))
        return data
    }

//Retrieves all chats new messages
//     const chatsAllNew = getAllChatsNewMsg();

// Retrieve chat/conversation
//     const chat = await client.getChat('000000000000@c.us');


// Delete chat
//     await client.deleteChat('000000000000@c.us');



    // Group -------------------------------------------------------------------------

// Retrieve all groups
// you can pass the group id optional use, exemple: client.getAllChatsGroups('00000000-000000@g.us')
//     const chats = await client.getAllChatsGroups();

//Retrieve all groups new messages
//     const groupNewMsg = await client.getChatGroupNewMsg();

    // Leave group
    // await client.leaveGroup('00000000-000000@g.us');

// Get group members
//     await client.getGroupMembers('00000000-000000@g.us');

    // contact -------------------------------------------------------------------------
    // Retrieve contacts
    // const contacts = await client.getAllContacts();

//Retrieves all chats Contacts
//     const contacts = await client.getAllChatsContacts();

//Retrieve all contacts new messages
//     const contactNewMsg = await client.getChatContactNewMsg();


    // Misc -------------------------------------------------------------------------


// Retrieve user profile
//     const user = await client.getNumberProfile('000000000000@c.us');

// Retrieve profile fic (as url)
//     const url = await client.getProfilePicFromServer('000000000000@c.us');


    // Disconnect from service
    async logout() {
        return await this.client?.logout();
    }

    // Delete the Service Worker
    async killServiceWorker() {
        return await this.client?.killServiceWorker();
    }

    // Load the service again
    async restartService() {
        return await this.client?.restartService();
    }

    // Get connection state
    async getConnectionState() {
        return await this.client?.getConnectionState();
    }

    // Get battery level
    async getBatteryLevel() {
        return await this.client?.getBatteryLevel();
    }

    // Is connected
    async isConnected() {
        return await this.client?.isConnected();
    }

    close() {
        this.client?.close();
    }
}

exports.Whatsapp = Whatsapp