const Model = require("../models/device")

exports.getAll = async () => {
    const result = await  Model.find().sort({'updatedAt' : 1})
    return result
}

exports.findBy = async (q) => {
    const result = await  Model.find(q)
    return result
}

exports.create = async (attr) => {
    const db = new Model(attr)
    return await db.save()
}

exports.update = async (token, attr) => {
    const db = await this.findBy({ token })
    db.name = attr.name
    return await db.save()
}

exports.destroy = async (token) => {
    const result = await Model.deleteOne({ token })
    return result
}