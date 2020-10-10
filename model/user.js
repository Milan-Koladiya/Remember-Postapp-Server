const mongoose = require('mongoose')
const validator = require('validator')
const connection = require('../connection/connection')

const schema = new mongoose.Schema({
    Username: {
        type: String,
        trim: true,
        unique: true,
    },
    Emailid: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error()
            }
        }
    },
    Password: {
        type: String,
        trim: true,
        validate(value) {
            value.toLowerCase()
            if (value.includes('password')) {
                res.status(400).json({ error: 'password is contain password' })
                throw new Error()
            }
        }
    },
    avtar: {
        type: String,
        default: ''
    },
    tokens: [{
        token: {
            type: String,
        }
    }
    ]
})

const model = mongoose.model('user', schema);

module.exports = model;