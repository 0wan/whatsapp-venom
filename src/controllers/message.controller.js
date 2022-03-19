exports.all = async (req, res) => {
    const data = await WhatsApps[req.query.key].getAllMessages(
        req.query.id
    )
    return res.status(200).json({ error: false, data: data })
}
exports.text = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendTextMessage(
        req.query.id,
        req.body.message || req.query.message
    )
    return res.status(201).json({ error: false, data: data })
}
exports.list  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendListMessage(
        req.query.id,
        req.body.title || req.query.title,
        req.body.subtitle || req.query.subtitle,
        req.body.description || req.query.description,
        req.body.button || req.query.button,
        req.body.list || req.query.list
    )
    return res.status(201).json({ error: false, data: data })
}
exports.button  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendButtonMessage(
        req.query.id,
        req.body.title || req.query.title,
        req.body.buttons || req.query.buttons,
        req.body.description || req.query.description,
    )
    return res.status(201).json({ error: false, data: data })
}
exports.file  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendFileMessage(
        req.query.id,
        req.body.file,
        req.body.filename,
        req.body.caption,
    )
    return res.status(201).json({ error: false, data: data })
}
exports.image  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendImageMessage(
        req.query.id,
        req.body.image,
        req.body.filename,
        req.body.caption,
    )
    return res.status(201).json({ error: false, data: data })
}
exports.sticker  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendImageSticker(
        req.query.id,
        req.body.image,
        req.body.gif || false,
    )
    return res.status(201).json({ error: false, data: data })
}
exports.voice  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendVoiceMessage(
        req.query.id,
        req.body.voice
    )
    return res.status(201).json({ error: false, data: data })
}
exports.link  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendLinkMessage(
        req.query.id,
        req.body.link,
        req.body.caption,
    )
    return res.status(201).json({ error: false, data: data })
}
exports.reply  = async (req, res) => {
    const data = await WhatsApps[req.query.key].sendReplyMessage(
        req.query.id,
        req.body.message,
        req.body.from,
    )
    return res.status(201).json({ error: false, data: data })
}
