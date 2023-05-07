const express = require('express')
const app = express()
const Router = express.Router()
const Controller = require('../controllers/userController')
const AuthController = require('../controllers/authController')


Router.patch('/resetPassword/:otp', AuthController.resetPassword)
Router.post('/forgotPassword', AuthController.forgotPassword)
Router.post('/signup',AuthController.signup )
Router.post('/login',AuthController.login )


Router.route('/').get(Controller.getUsers)

module.exports = Router
