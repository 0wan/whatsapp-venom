const Model = require("../models/chat")

exports.getAll = async (key) => {
    const result = await  Model.find({key: key})
    return result
}

exports.getByWhatsAppId = async (key, phone) => {
    const result = await  Model.find({key: key})
    return result
}

exports.create = async (key, chat) => {
    const db = new Model({key, chat})
    return await db.save()
}

exports.update = async (key, chatId) => {

}

exports.destroy = async (key, chatId) => {

}