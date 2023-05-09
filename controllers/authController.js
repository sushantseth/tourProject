const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { appError } = require('../utils/appError')
const bcrypt = require('bcryptjs')
const util = require('util')
const {generateOTP} = require('../utils/createOTP')
const {getMail} = require('../utils/emailFeature')

// const setCookie = (jwt, environment, expiry) =>{
//     const cookieOptions = {
//         maxAge :  expiry * 24 * 60 * 60 * 1000,
//         httpOnly : true
//     }
//     if(environment === 'production'){
//         //for only https protocols
//         cookieOptions.secure = true 
//     }
//     res.cookie('jwt', jwt, cookieOptions)
// }

const jwtSign = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)

        const token = jwtSign(newUser._id)
        // setCookie(token, process.env.NODE_ENV, process.env.COOKIE_JWT_EXPIRES_IN)
        const cookieOptions = {
            maxAge :  process.env.COOKIE_JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
            httpOnly : true
        }
        if(process.env.NODE_ENV === 'production'){
            //for only https protocols
            cookieOptions.secure = true 
        }
        res.cookie('jwt', token, cookieOptions)

        return res.status(200).json({
            status: "success",
            token: token,
            message: {
                data: newUser
            }
        })

    } catch (error) {
        await User.findOneAndDelete({email : req.body.email})
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
        if (!userData)  return next(appError("user does not exist.", 401))

        // 4 - check if user changed the password
        if (userData.passwordUpdateDate > decodedVal.iat) return next(appError("password changed. Login again", 401))

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

exports.forgotPassword = async (req,res,next) => {
    try {

    
    //1 - find a user with the email
    const userData = await User.findOne({email : req.body.email})   
    console.log(userData)
    if(!userData) return next(appError('user not found with this mail id',401))



    //2 - if user present, generate a 6 digit OTP and expiry time and store in user db
    const {otp, expiresIn} = generateOTP()    
    await  User.findOneAndUpdate({email : req.body.email},{otp : Number(otp) , otpexpiresIn : expiresIn })



     //3 - send the otp to usermail
    const email = req.body.email
    const subject = `One time password (OTP)`
    const message = `Your One time Password which is valid for 10 minutes is. : ${otp} at time : ${new Date()}`
    await getMail({
            email,
            subject,
            message
        })
      
 
    return res.status(200).json({
        status : 'success',
        message : 'OTP sent to email id'
    })
 
    } catch (error) {
        
        await  User.findOneAndUpdate({email : req.body.email}, { $unset: { otp: "", otpexpiresIn: "" } })
        return next(appError('error in sending mail',500))
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
    const userOTP = req.params.otp;
    const {newPassword, confirmNewPassword} = req.body;
    
    const now = new Date(); 
    const currentTime = new Date(now.getTime());
    const userData = await User.findOne({otp : userOTP, otpexpiresIn : {$gt : currentTime}})
    if(!userData) return next(appError('user not found',401))

    if(!(userData.otp == userOTP && currentTime < userData.otpexpiresIn)) return next(appError('OTP expired or invalid OTP',401))

    if(!newPassword && !confirmNewPassword) return next(appError('enter all fields',401))

    if(newPassword.length < 10) return next(appError('password length > 10',401))

    if(await bcrypt.compare(newPassword, req.user.password) === true) return next(appError('new Password cannot be same as old password',401))

    if(newPassword !== confirmNewPassword) return next(appError('new password and confirm password doesnt match',401))

    const encryptedNewPass = await bcrypt.hash(newPassword,12)

    await User.findOneAndUpdate({email : userData.email},
        {password : encryptedNewPass, passwordUpdateDate : new Date().getTime()/1000, $unset: { otp: "", otpexpiresIn: "" } })

    return res.status(200).json({
        status : 'success'
    })
    } catch (error) {
    
            next(appError(error.toString(),500))
        
        
    }
}


exports.updatePassword = async(req, res, next) => {
    try {
    //1 - before coming to the controller, check for a valid jwt
    //2 - check old password
    if(await bcrypt.compare(req.body.oldPassword, req.user.password) !== true) return next(appError('old password does not match',401))
    //3 - compare new password and confirm password field and field len
    if(req.body.oldPassword === req.body.newPassword) return next(appError('old password and new password cannt be same',401))
    if(req.body.newPassword !== req.body.confirmNewPassword) return next(appError('new and confirm password does not match',401))
    if(req.body.newPassword.length < 10) return next(appError('new password should be > 10',401))

    //4 - bcrypt newpassword and replace password field in db
    const encryptedPassword = await bcrypt.hash(req.body.newPassword,12)

    //5 - send updated token
    const token = jwtSign(req.user._id)

    await User.findOneAndUpdate({_id : req.user._id},{password : encryptedPassword})
    return res.status(200).json({
        status : "sucess",
        token
    })
    
    } catch (error) {
        return next(appError(error.toString(),500))
    }
}
