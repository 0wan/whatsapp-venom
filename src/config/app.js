// PORT
const PORT = '3000'
// MONGO DB
const MONGODB = 'mongodb://127.0.0.1:27017/WhatsAppVenom'

module.exports = {
    port: PORT,
    mongoose: {
        url: MONGODB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    }
}