const express = require('express')
const app = express()
const Router = express.Router()
const Controller = require('../controllers/userController')


Router.route('/').get(Controller.getUsers)

module.exports = Router