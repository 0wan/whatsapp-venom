const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //
}, { strict: false })

const Model = mongoose.model('Chat', schema)

module.exports = Model
