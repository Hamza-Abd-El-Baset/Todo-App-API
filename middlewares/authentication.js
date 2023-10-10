const User = require('../models/User')

module.exports = async (req, res, next) => {
    try {
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
            const user = await User.getUserFromToken(token)
            if(!user) {
                throw new Error("Wrong Token")
            }
            const { ID } = user
            req.body.userID = ID
            next()
        }
        else {
            throw new Error("Authorization is required")
        }
        
    }
    catch (err) {
        err.statusCode = 401
        next(err)
    }
}