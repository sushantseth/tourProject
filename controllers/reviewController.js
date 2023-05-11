const Review = require('../models/reviewModel')
const { appError } = require('../utils/appError')

exports.createReview = async(req,res,next)=>{

    try {
        const userid = req.user._id
        const result = await Review.create({...req.body, user :  userid})
        return res.status(200).json({
            status : 'success'
        })
    } catch (error) {
        return next(appError(error.toString(),400))
    }
}


exports.getReviews = async(req,res,next)=>{
    try {
        const result = await Review.find({})
        return res.status(200).json({
            status : 'success',
            data : result
        })
    } catch (error) {
        return next(appError(error.toString(),400))
    }
}