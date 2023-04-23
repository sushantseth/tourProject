const express = require('express')
const app = express()
const Router = express.Router()
const Controller = require('../controllers/tourController')

//middleware to check whether the params is valid. instead of writing a condition in every controller
//we can have a specific middleware which checks it
Router.param('id',Controller.checkID)



Router.route('/:id').get(Controller.getTourById)
Router.route('/').post(Controller.checkBody , Controller.addTour)


module.exports  = Router