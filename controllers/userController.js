const User = require("../models/userModel")
const { appError } = require("../utils/appError")


 exports.getUsers = async(req, res) => {
    try{
    const users = await User.find({isActive : {$ne : false}})
    return res.status(200).json({
        message : "true",
        data : users
    })
}catch(err){
    return next(appError(err.toString(),401))
}
}

exports.updateProfile = async(req,res,next) => {
    try {
    const name = req.body.name;
    const userData = await User.findOneAndUpdate({_id : req.user._id},{name : name},{new : true, runValidators : true})


    return res.status(200).json({
        status : 'success',
        user : userData
    })

    } catch (error) {
        return next(appError(error.toString(),401))
    }
}

exports.deleteProfile = async(req,res,next) => {
    try {
        console.log(req.user)
    await User.findOneAndUpdate({email : req.user.email},{isActive : false})
    return res.status(204).json({
        message : "user deleted"
    })
    } catch (error) {
        return next(appError(error.toString(),500))
    }
}