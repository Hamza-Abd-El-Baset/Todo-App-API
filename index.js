const { port } = require('./config')

const express = require("express")
const app = express()

const tasksRouter = require('./routers/tasks')
const usersRouter = require('./routers/users')

const morgan = require('morgan')

//Middlewares
app.use(express.json())
app.use('/', morgan('dev'))


//Routers
app.use(['/task', '/tasks'], tasksRouter)
app.use(['/user','/users'], usersRouter) 


//Error Handlers
app.use((err, req, res, next)=>{
     res.status(err.statusCode || 500)
     .send({
        errorMsg : err.statusCode < 500 ? err.message : "Something went wrong"
     })
 })


//Listening
app.listen(port, ()=>{
    `server is now running on port:${port}`
})

