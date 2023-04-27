const Tour = require('../models/tourModel')
const {queryFunction} = require('../utils/apiFeatures')
//add alias middleware for top5Tours
exports.aliasTop5Tour = (req,res,next) => {
  req.query.sort = "-ratingsAverage,-price"
  req.query.limit = 5
 next()
}

//controller to check the params is valid or not
//this controller will be used in the Router.params middleware which has the fourth value which contains the params value
// exports.checkID = (req,res,next,val) => {
//     const params = req.params
//     const result = tourData.filter((el)=>  el.id === Number(params.id))
//     console.log(`params value is ${val}`)
//     if(result.length === 0){
//     return res.status(404).json({
//         status : "success",
//         result : {
//             tourData : "not found"
//         }
//     })
// }
// next()
// }


 exports.getTourById = async(req,res)=>{
    try{
    
    const params = Number(req.params.id)
    const result = await Tour.find({id:params})
    return res.status(200).json({
        status :"success",
        message:{
            result:result
        }
    })

    }catch(err){
        return res.status(400).json({
            status:"fail",
            errorMessage : err
        })
    }
}


exports.getTours = async(req,res)=>{
    try{
    const query = queryFunction(Tour,req.query)
    const result = await query
    return res.status(200).json({
        status :"success",
        documentCount : result.length,
        message:{
            result:result
        }
    })
    }catch(err){
        return res.status(400).json({
            status:"fail",
            errorMessage : err
        })
    }
}

 exports.addTour = async(req,res)=>{
    try{
    const result = await Tour.create(req.body)

    return res.status(200).json({
        status : "success",
        message:{
            result: result
        }
    })
    }catch(err){
       return res.status(400).json({
            status: "fail",
            errorMessage : err
        })
    }

}

exports.updateTourById = async(req,res)=>{
    try{
    const params = Number(req.params.id)
    const result = await Tour.findOneAndUpdate({id:params},req.body, 
        {new : true,
        upsert : false,
        runValidators: true})
    return res.status(200).json({
        status :"success",
        message:{
            result:result
        }
    })

    }catch(err){
        return res.status(400).json({
            status:"fail",
            errorMessage : err
        })
    }
}

exports.deleteTourById = async(req,res)=>{
    try{
    const params = Number(req.params.id)
    const result = await Tour.findOneAndDelete({id:params})
    return res.status(204).json({
        status :"success",
    
    })

    }catch(err){
        return res.status(400).json({
            status:"fail",
            errorMessage : err
        })
    }
}

exports.tourStats = async (req,res) => {
try{
    console.log("inside tourStats")

    const result = await Tour.aggregate([
        {$match : 
            {ratingsAverage : {$gte : 4.7}}
        },
        {$group : 
            {_id : "$difficulty",
             avgRating : {$avg : "$ratingsAverage"},
            minimumPrice : {$min : "$price"},
            maxPrice : {$max : "$price"}   
            }
        },
        {$sort : {avgRating : -1}}
    ])
    return res.status(200).json({
        status :"success aggregation",
        result : result
    })

}catch(err){
    return res.status(400).json({
        status:"fail",
        errorMessage : err
    })
}

}

exports.getTourByMonth = async (req, res) => {
   try {
    const result = await Tour.aggregate([
        {$unwind : '$startDates'},
        {$match : {startDates : {$gte : new Date(`${req.params.year}-01-01`) , $lte : new Date(`${req.params.year}-12-31`)}}},
        {$group : 
            {
            _id : {$month : '$startDates'},
            allTours : {$push : '$name'},
            docCount : {$count : {}}    
        }
    },{
        $project : {_id : 0}
    }
    ])

    return res.status(200).json({
        status :"success aggregation",
        count : result.length,
        result : result
    })
   } catch (err) {
    return res.status(400).json({
        status:"fail",
        errorMessage : err
   })
}
}
// exports.checkBody = (req,res,next) => {
//     console.log("req.body",req.body)
//     if(!req.body.name){
//         return res.status(400).json({
//             status : "fail",
//             result : {
//                 tourData : "name not provided"
//             }
//         }) 
//     }
//     next()
// }
