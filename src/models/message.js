const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    key: String,
    id: {
        type: String,
        required: true,
        unique: true,
    },
}, { strict: false })

const Model = mongoose.model('Message', schema)

module.exports = Model
