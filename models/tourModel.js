
const mongoose = require('mongoose')
const Counter = require('../models/counterModel')
const User = require('./userModel')

//created schema
const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "name not mentioned"],
        unique : true,
        trim : true,
        minLength : [10, "minimum length accepted is 10"],
        maxLength : [40, "maximum length accepted is 40"]
    },
    ratingsAverage : {
        type : Number,
        default : 4,
        min : [1, "minimum rating accepted is 1"],
        max : [5, "maximum rating accepted is 5"]
    },
    price : {
        type : Number,
        required : [true, "price not mentioned"]
    },
    discountPrice : {
        type : Number,
        //does not work for update. Only create
        validate : {
            validator : function (val){
                //this returns either true or false. in case false, then message is received in response
                return val < this.price
            },
            message : "discountPrice greater than price "
        }
    },
    summary : {
        type : String,
        required : [true, "summary not provided"],
        trim : true
    },
    difficulty : {
        type : String,
        enum : ["difficult","medium","easy"],
        required : [true, "difficulty not provided"],
        enum : {
            values : ["easy", "medium", "difficult"],
            message : ["values accepted : easy, medium, difficult"]
        }
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
    secretTour : Boolean,
    locations : [
        {
            type : {
                type : String,
                default : 'Point',
                enum : ['Point']
            },
            description : String,
            coordinates : [Number],
            day : Number
        }
], guides : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
}]

},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true}
})

// tourSchema.virtual('discount').get(function(){
//     return this.price/2
// })
//document middleware

tourSchema.pre('save',async function(next){
    // this.guides = await User.find({_id : {$in : this.guides}})
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
