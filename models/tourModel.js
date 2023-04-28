
const mongoose = require('mongoose')
const Counter = require('../models/counterModel')

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
    },
    secretTour : Boolean

},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true}
})

tourSchema.virtual('shortSummary').get(function(){
    return this.summary.slice(0,10)
})

//document middleware

tourSchema.pre('save',function(next){
    const Tour = mongoose.model('Tour',tourSchema)
    Tour.findOne({name : this.name})
    .then((data)=>{
        if(data){
            return next(new Error("tour already exists"))
        }
        next()
    })
    .catch(err => next(err));
})

tourSchema.post('save',function(doc,next){
    Counter.findOneAndUpdate({name : "TourCounter"},{$inc : {count : 1}},{upsert : true, new : true})
    .then((data)=> next())
    .catch(err => next(err))
})

//query middleware
tourSchema.pre(`/^find`,function(next){
    //this object is the query object 
    this.where({secretTour : {$ne : true}})
    //regular property can be assigned to the query object too
    next()
})

tourSchema.post(`/^find`,function(doc, next){
    next()
})

//aggregation middleware
tourSchema.pre('aggregate',function(next){
    //this refers to the aggregation object
    //unshift to add a new object at the beginning
    this.pipeline().unshift({$match : {price : {$gte : 2000}}})
    next()
})


//created model
const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour
