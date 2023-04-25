
const mongoose = require('mongoose')


//created schema
const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "name not mentioned"],
        unique : true,
        trim : true
    },
    ratingsAverage : {
        type : Number,
        default : 4
    },
    price : {
        type : Number,
        required : [true, "price not mentioned"]
    },
    summary : {
        type : String,
        required : [true, "summary not provided"],
        trim : true
    },
    difficulty : {
        type : String,
        enum : ["difficult","medium","easy"],
        required : [true, "difficulty not provided"]
    },
    maxGroupSize : {
        type : Number,
        default : 10
    },
    ratingsQuantity : {
        type : Number
    },
    images : [String],
    imageCover : {
        type : String,
        required : [true, "cover image not provided"]
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false //to not show the field in response
    },
    startDates : [Date],
    description : {
        type : String,
        trim : true
    }

})

//created model
const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour
