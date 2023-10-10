const express = require("express")

const router = express.Router()

const genderateId = require('../helpers/generateId')
require('../db')

const Task = require('../models/Task')

//middlewares
const authentication = require('../middlewares/authentication')
router.use(authentication)


//Create (Adding new task)

router.post('/', async (req, res, next) => {

    try {
        const { name, status, time, priority, userID} = req.body
        const ID = await genderateId(Task)
        
        const newTask = {
            ID,
            name,
            status: status || 'to-do',
            time,
            priority: priority || 'low',
            userID
        }
        
        
        const createdTask = new Task(newTask)
        const savedTask = await createdTask.save()
        res.send(`Task added: ${savedTask}`)
    }
    
    catch(err) {
        err.statusCode = 422
        next(err)
    }
})


//Read (list all tasks)
router.get('/', async (req, res, next)=>{
    
    try {
        const filter = {...req.query, ...req.body}
        const filteredTasks = await Task.find(filter)
        res.send(filteredTasks)    
    }

    catch(err) {
        err.statusCode = 422
        next(err)
    }
    
})


//Reading (listing) specific task using id as a req parameter
router.get('/:ID', async (req, res, next) => {
    
    const { ID } = req.params
    const { userID } = req.body
    const filter = {
        ID,
        userID
    }
        
    try {
        const filteredTasks = await Task.find(filter)
        res.send(filteredTasks)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }
})

//update specific task
router.patch('/:ID', async (req, res, next) => {
    
    const { ID } = req.params
    const { userID } = req.body
    const filter = {
        ID,
        userID
    }
    const update = req.body
    
    
    try {
        const updateResult = await Task.updateOne(filter, update)
        res.send(updateResult)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }

    
})



//delete
router.delete('/:ID', async (req, res, next) => {
    
    const { ID } = req.params
    const { userID } = req.body
    const filter = {
        ID,
        userID
    }
    
    try {
        const deleteResult = await Task.deleteOne(filter)
        res.send(deleteResult)    
    }

    catch(err) {
        err.statusCode = 404
        next(err)
    }
    
    
})



module.exports = router