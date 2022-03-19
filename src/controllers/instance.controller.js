const fs = require('fs')
const path = require('path')
const { Whatsapp } = require('../services/whatsapp')

exports.init = async (req, res) => {
    const key = req.query.key
    const instance = new Whatsapp(key)
    const data = await instance.init()
    WhatsApps[data.key] = instance

    res.json({
        error: false,
        message: 'Initializing successfull',
        key: data.key,
    })
}

exports.qr = async (req, res) => {
    try {
        const qrcode = await WhatsApps[req.query.key].instance.qr
        res.render('pages/qr', {
            qrcode: qrcode
        })
    } catch {
        res.json({
            error: true,
            qrcode: ''
        })
    }

}

exports.info = async (req, res) => {
    const instance = WhatsApps[req.query.key]
    let data = ''
    try {
        data = await instance.getInstanceDetail(req.query.key)
    } catch {
        data = {}
    }
    res.json({
        error: false,
        message: 'Instance fetched successfully',
        data: data
    })
}

exports.restore = async (req, res) => {
    res.json({
        error: false,
        //
    })
}

exports.logout = async (req, res) => {
    res.json({
        error: false,
        //
    })
}

exports.delete = async (req, res) => {
    res.json({
        error: false,
        //
    })
}