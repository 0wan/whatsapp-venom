const Device = require('../repositories/device.repository')

exports.index = async (req, res) => {
    const devices = await Device.getAll();

    res.render('pages/device', {
        devices
    })
}

exports.create = async (req, res) => {
    res.render('pages/device/create', {

    })
}

exports.store = async (req, res) => {
    // save device then redirect to device/:token
    const name = req.body.name
    const rs = await Device.create({ name, token: 'random' })

    res.redirect('/device/' + rs.token)
}

exports.show = async (req, res) => {
    const token = req.params.token

    res.render('pages/app', { token })
}

exports.status = async (req, res) => {
    const token = req.params.token
}

exports.destroy = async (req, res) => {
    const token = req.params.token

    await Device.destroy(token)
    // check whtasapp dan delete

    res.redirect('/device')
}