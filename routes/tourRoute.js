const express = require('express')
const app = express()
const Router = express.Router()
const Controller = require('../controllers/tourController')
const AuthController = require('../controllers/authController')
//middleware to check whether the params is valid. instead of writing a condition in every controller
//we can have a specific middleware which checks it
// Router.param('id',Controller.checkID)

Router.route('/top5tour').get(Controller.aliasTop5Tour , Controller.getTours)
Router.route('/').post( Controller.addTour).get(AuthController.protect, Controller.getTours)
Router.route('/tourStats').get(Controller.tourStats)
Router.route('/getTourByMonth/:year?').get(Controller.getTourByMonth)
Router.route('/:id').get(Controller.getTourById).patch(Controller.updateTourById).delete(AuthController.protect, AuthController.ristrict, Controller.deleteTourById)



module.exports  = Router
