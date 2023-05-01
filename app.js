const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')
const errorGlobalHandler = require('./controllers/errorController')
const {appError} = require('./utils/appError')
app.use(express.json())
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

//logger 3rd party middleware to log the 
if(process.env.NODE_ENV === "development"){
app.use(morgan('common',
{
    stream: fs.createWriteStream('Logger.txt', { flags: 'a' }) ,
    skip: function (req, res) { return res.statusCode > 400 }
} 
  ))

  app.use(morgan('common',
{
    stream: fs.createWriteStream('Error.txt', { flags: 'a' }) ,
  skip: function (req, res) { return res.statusCode < 400 }
} 
  ))
}

app.use(express.static(`${__dirname}/public`))

app.use('/v1/tours',tourRouter)
app.use('/v1/users',userRouter)

app.all("*",(req,res,next)=>{
 next(appError("invalid route",404))
})

app.use(errorGlobalHandler)

module.exports = app