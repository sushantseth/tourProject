const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')
const errorGlobalHandler = require('./controllers/errorController')
const {appError} = require('./utils/appError')
app.use(express.json())
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')
const reviewRouter = require('./routes/reviewRoute')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp')
//to add necessary headers in response
app.use(helmet())


//nosql injection attack prevention middleware ( sending query instead of value) - removes . and $
app.use(mongoSanitize())

//cross site scripting prevent middleware (sending js in html code)
app.use(xss())

//http parameter pollution prevention
app.use(hpp())

//logger 3rd party middleware to log  
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


const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message : "too many request from the same IP"
}) 
//
app.use('/v1', apiLimiter)

app.use('/v1/tours',tourRouter)
app.use('/v1/users',userRouter)
app.use('/v1/reviews',reviewRouter)


app.all("*",(req,res,next)=>{
 next(appError("invalid route",404))
})

app.use(errorGlobalHandler)

module.exports = app
