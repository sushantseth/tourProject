const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')
const tourData = JSON.parse(fs.readFileSync(`${__dirname}/data/tourData.json`))
app.use(express.json())
const tourRouter = express.Router()
const userRouter = express.Router()
//logger 3rd party middleware to log the 
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


const getTourById = (req,res)=>{
    const params = req.params
    const result = tourData.filter((el)=>  el.id === Number(params.id))
    if(result.length > 0){
    res.status(200).json({
        status : "success",
        result : {
            tourData : result
        }
    })
}else{
    res.status(404).json({
        status : "success",
        result : {
            tourData : "not found"
        }
    })
}
}

const addTour = (req,res)=>{
    const body = req.body;
    console.log(body)
    const tourId = tourData[tourData.length - 1].id + 1
    const responseData = {id : tourId, ...body}
    const updatedData = [responseData, ...tourData]
    console.log(responseData)
    fs.writeFile(`${__dirname}/data/tourData.json`,JSON.stringify(updatedData), (err) =>{
        if(err) res.status(400).json({message : "error occured"})
        res.status(200).json({
            message:"success",
            data:{
                tour : responseData
            }
        })
    } )
}

const getUsers = (req, res) => {
    res.status(200).json({
        message : "fail",
        data : "data pending..."
    })
}
// app.get('/v1/tours/:id',getTourById)
// app.post('/v1/tours',addTour)
app.use('/v1/tours',tourRouter)
app.use('/v1/users',userRouter)


tourRouter.route('/:id').get(getTourById)
tourRouter.route('/').post(addTour)
userRouter.route('/').get(getUsers)


const port = 3000
app.listen(port,()=>{
    console.log(`server running on port : ${port} `)
})