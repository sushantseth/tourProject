const express = require('express')
const Router = express.Router()
const AuthController = require('../controllers/authController')
const ReviewController = require('../controllers/reviewController')


Router.route('/')
.get(ReviewController.getReviews)
.post(AuthController.protect, AuthController.ristrict, ReviewController.createReview)


module.exports = Router

