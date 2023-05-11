const mongoose = require('mongoose')
const Tour = require('./tourModel')
const User = require('./userModel')


//review / rating / createdAt /  ref to tour / ref to user

const reviewSchema = new mongoose.Schema({
    review : {
        type : String,
        required : [true, 'review not mentioned'],
        minLength : [10, 'minimum 10 characters accepted']
    },
    rating : {
        type : Number,
        default : 1,
        required : [true, 'rating not mentioned'],
        min : [1, 'minimum rating 1 accepted'],
        max : [5, 'maximum rating 1 accepted']
    },
    createdAt : {
        type : Date,
        required : [true, 'createdAt not mentioned'],
        default : Date.now()
    },
    tour : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Tour,
        required : [true,'tourID required']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User
    }

})

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path : 'user',
        select : 'name email -_id'
    }).populate({
        path : 'tour',
        select : 'name'
    })
    next()
})

const Review = mongoose.model('review',reviewSchema)


module.exports = Review