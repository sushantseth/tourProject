
//error handling for sync code
process.on("uncaughtException",(err)=> {
    console.log(`Name : ${err.name} and message : ${err.message} in uncaught exception!!!`)
     process.exit(1)
       //0 for success and 1 for exception
})

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path : "./config.env"})
const app = require('./app')

console.log(process.env.NODE_ENV)
const DB = process.env.DATABASE
//mongoose.connect is a promise
mongoose.connect(DB).then(()=> console.log("connected to the DB"))


const port = process.env.PORT || 3000
const server = app.listen(port,()=>{
    console.log(`server running on port : ${port} `)
})

//if there is an unhandled promise rejection process emits an unhandledRejection object
//we can subscribe to the event :

process.on('unhandledRejection',(err)=> {
    console.log(`Name : ${err.name} and message : ${err.message} in unhandledRejection!!!`)
    //this will execute the task still pending or are being executed
    server.close(()=>  process.exit(1))
       //0 for success and 1 for uncalled exception
})

