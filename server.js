const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path : "./config.env"})
const app = require('./app')

console.log(process.env.NODE_ENV)
const DB = process.env.DATABASE
//mongoose.connect is a promise
mongoose.connect(DB).then(()=> console.log("connected to the DB"))


const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server running on port : ${port} `)
})