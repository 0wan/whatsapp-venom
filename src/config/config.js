const APP_NAME = process.env.APP_NAME ||  'whatsapp-venom'
// PORT
const PORT = process.env.PORT || '3000'
const TOKEN = process.env.TOKEN || ''

const APP_URL = process.env.APP_URL || false

const LOG_LEVEL = process.env.LOG_LEVEL

const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'Whatsapp Venom'
const CLIENT_BROWSER = process.env.CLIENT_BROWSER || 'Chrome'
const CLIENT_VERSION = process.env.CLIENT_VERSION || '4.0.0'

// MONGO DB
const MONGODB = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/WhatsAppVenom'

// PUSHER
const PUSHER_APP_ID = process.env.PUSHER_APP_ID || ''
const PUSHER_KEY = process.env.PUSHER_KEY || ''
const PUSHER_SECRET = process.env.PUSHER_SECRET || ''
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || 'ap1'

module.exports = {
    appName: APP_NAME,
    sessionName: APP_NAME,
    port: PORT,
    token: TOKEN,
    appUrl: APP_URL,
    log: {
        level: LOG_LEVEL,
    },
    mongoose: {
        url: MONGODB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    browser: {
        platform: CLIENT_PLATFORM,
        browser: CLIENT_BROWSER,
        version: CLIENT_VERSION,
    },
    pusher : {
        appId: PUSHER_APP_ID,
        key: PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: PUSHER_CLUSTER,
        useTLS: true,
    },
}