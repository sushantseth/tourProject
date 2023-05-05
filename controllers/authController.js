const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { appError } = require('../utils/appError')
const bcrypt = require('bcryptjs')
const util = require('util')
const jwtSign = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)

        const token = jwtSign(newUser._id)


        return res.status(200).json({
            status: "success",
            token: token,
            message: {
                data: newUser
            }
        })

    } catch (error) {
        return res.status(400).json({
            error: error.toString()
        })
    }
}

exports.login = async (req, res, next) => {
    try {

        if (!req.body.password || !req.body.email) {
            return next(appError("email and password required", 400))
        }

        const userData = await User.findOne({ email: req.body.email })
        if (userData && await bcrypt.compare(req.body.password, userData.password)) {
            const token = jwtSign(userData._id)
            return res.status(200).json({
                token
            })
        } else {
            return next(appError("user not found/ password incorrect", 400))
        }
    } catch (error) {
        return res.status(400).json({
            error: error.toString()
        })
    }


}

exports.protect = async (req, res, next) => {
    try {
        let token;
        // 1 - get token from headers
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            return next(appError('authorization not provided', 401))
        }

        // 2 - check if token is correct
        const decodedVal = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)

        // 3 - check if the user still exists
        const userData = await User.findById({ _id: decodedVal.id })
        if (!userData) {
            return next(appError("user does not exist.", 401))

        }

        // 4 - check if user changed the password
        if (userData.passwordUpdateDate > decodedVal.iat) {
            return next(appError("password changed. Login again", 401))
        }
        req.user = userData
        return next()
    } catch (error) {
        return next(appError(error, 401))
    }
}


exports.ristrict = (req, res, next) => {


    if (req.user.role !== "admin") {

        return next(appError('you are not authorized', 403))

    }
    return next()
}
