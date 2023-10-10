const mongoose = require('mongoose');
const { mongoURI } = require('./config')
mongoose.connect(mongoURI)
.then(() => {
    console.log("Connected to MongoDB Successfully")
})
.catch(err => {
    console.error(err)
    process.exit(1)
})

