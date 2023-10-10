const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    ID: Number,
    name: String,
    status: String,
    time: String,
    priority: String,
    userID: Number
})

const Task = mongoose.model('Task', schema)

module.exports = Task
