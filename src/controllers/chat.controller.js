const Chat = require('../repositories/chat.repository')

exports.getAll = async (req, res) => {
    // const data = await Chat.getAll(req.query.key)
    // return res.status(200).json({ error: false, data: data })
    const data = await WhatsApps[req.query.key].getAllChats()
    return res.status(200).json({ error: false, data: data })
}

exports.getById = async (req, res) => {
    const data = await Chat.getByWhatsAppId(
        req.query.key,
        req.query.phone,
    )
    return res.status(200).json({ error: false, data: data })
}
