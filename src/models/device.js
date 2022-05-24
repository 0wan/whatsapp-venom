const mongoose = require('mongoose')

const genToken = () => {
    const randToken = require('random-token');
    return randToken(16);
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true, strict: false })

schema.pre('save', function(next) {
    var device = this
    if (String(device.token).length > 15) return next();
    const token = genToken();
    device.token = token
    next();
})

const Model = mongoose.model('Device', schema)

module.exports = Model
