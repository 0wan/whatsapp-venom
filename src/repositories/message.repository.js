const Model = require("../models/message")

exports.getAll = async (key) => {
    const result = await  Model.find({key: key})
    return result
}

exports.getByWhatsAppId = async (key, phone) => {
    const result = await  Model.find({key: key}).sort({'timestamp' : 1})
    return result
}

exports.create = async (key, message) => {
    const db = new Model({key, ...message})
    return await db.save()
}

exports.ack = async (key, messageId, ack) => {
    // const db = await Model.findOne({'key':key, 'id': messageId})
    // db.ack = ack
    // return await db.save()
    return await Model.findOneAndUpdate({'key':key, 'id': messageId}, {'ack': ack}, {new: true})
}

exports.update = async (key, messageId) => {

}

exports.destroy = async (key, messageId) => {

}