const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')
const tourData = JSON.parse(fs.readFileSync(`${__dirname}/data/tourData.json`))
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

module.exports = app