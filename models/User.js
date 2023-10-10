const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { saltRounds, jwtSecret } = require('../config')
const jwt = require('jsonwebtoken')
const util = require('util')
const jwtSign = util.promisify(jwt.sign)
const jwtVerify = util.promisify(jwt.verify)

const schema = new mongoose.Schema({
    ID: Number,

    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    birthdate: {
        type: Date,
        max: "2023-07-01" //works only in case of post  not patch
    },

    email: String,
    phoneNumber: String,

})

schema.pre('save', async function() {
    const currentDoucument = this
    if(currentDoucument.isModified("password"))
    currentDoucument.password = await bcrypt.hash(currentDoucument.password, saltRounds)
})

schema.methods.checkPassword = function(plainPassword) {
    const currentDoucument = this
    return bcrypt.compare(plainPassword, currentDoucument.password)
}

schema.methods.generateToken = function() {
    const currentDoucument = this
    return jwtSign({ID: currentDoucument.ID}, jwtSecret, {expiresIn: "1h"})
}

schema.statics.getUserFromToken = async function(token) {
    const User = this
    const payload = await jwtVerify(token, jwtSecret)
    const { ID } = payload
    const user = await User.findOne({ ID })
    return user
}

const User = mongoose.model('User', schema)


module.exports = User
