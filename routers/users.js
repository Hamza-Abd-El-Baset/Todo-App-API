const express = require("express")

const router = express.Router()


const genderateId = require('../helpers/generateId')
require('../db')

const User = require('../models/User')


const {check, validationResult} = require('express-validator')


//Create (Adding new user)

router.post('/', async (req, res, next) => {

    try {
        const { username, password, firstname, lastname, birthdate, email, phoneNumber} = req.body
        const ID = await genderateId(User)
        
        const newUser = {
            ID,
            username,
            password,
            firstname,
            lastname,
            birthdate: birthdate || null,
            email: email || null,
            phoneNumber: phoneNumber || null
        }
        
        
        const createdUser = new User(newUser)
        const savedUser = await createdUser.save()
        res.send(`User added: ${savedUser}`)
    }
    
    catch(err) {
        err.statusCode = 422
        next(err)
    }
})

//Login using a certain user
router.post('/login', 
[check("username").exists(),
check("password").exists()],
async (req, res, next) => {
    
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const error = new Error("Username or Password is missing")
            error.statusCode = 401
            throw error
        }
        
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user) {
            const error = new Error("Invalid username or password")
            error.statusCode = 401
            throw error
        }
        else {
            const isMatch = user.checkPassword(password)
            if(!isMatch) {
                const error = new Error("Invalid username or password")
                error.statusCode = 401
                throw error
            }
            else {
                const token = await user.generateToken()
                res.send({
                    user,
                    token
                })
            }
        }
    }
    catch(err) {
        next(err)
    }
})


//Read (list all users)
router.get('/', async (req, res, next)=>{
    
    try {
        const filter = req.query
        const filteredUsers = await User.find(filter)
        res.send(filteredUsers)    
    }

    catch(err) {
        err.statusCode = 422
        next(err)
    }
    
})


//Reading (listing) specific user using id as a req parameter
router.get('/:ID', async (req, res, next) => {
    
    const ID = req.params.ID

    const filter = {ID}
        
    try {
        const filteredUsers = await User.find(filter)
        res.send(filteredUsers)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }
})

//update a specific user
router.patch('/:ID', async (req, res, next) => {
    
    const ID = req.params.ID
    const update = req.body
    
    const filter = {ID}
    
    try {
        const updateResult = await User.updateOne(filter, update)
        res.send(updateResult)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }

    
})



//delete
router.delete('/:ID', async (req, res, next) => {
    
    const ID = req.params.ID

    const filter = {ID}
    
    try {
        const deleteResult = await User.deleteOne(filter)
        res.send(deleteResult)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }
    
    
})



module.exports = router