const Tour = require('../models/tourModel')

//add alias middleware for top5Tours
const aliasTop5Tour = (req,res,next) => {
  req.query.fields = "ratingsAverage,price"
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
    console.log(req.query)
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
    
    // console.log(req.query)
    let queryObj = {...req.query}
    const excludedFields = ["page","sort","limit","fields"]
    excludedFields.forEach(el => delete queryObj[el])
    // console.log(queryObj)
    const updatedQuery = JSON.parse(JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, match => {
        switch (match) {
          case 'gte':
            return '$gte';
          case 'gt':
            return '$gt';
          case 'lte':
            return '$lte';
          case 'lt':
            return '$lt';
          default:
            return match;
        }
      }));
    //   console.log(updatedQuery)

    const query =  Tour.find(updatedQuery)
    
    //price mentioned in query params for sorting (?sort=price)
    //we can mention -> ?sort=-price for descending. Default ascending
    //we can mention second criteria based on which it can sort if tie happens, in this case ratingAverage
    if(req.query.sort){
     const sortBy = req.body.sort(",").join(" ")
     query.sort(sortBy)
    }
     //used to project only provided fields
    if(req.query.fields){
     const selectBy = req.body.sort(",").join(" ")
     query.select(selectBy)
    }else{
     //this will remove those fields in the response
     query.select("-createdDate") 
    }
     //implement skip and limit as well
     
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
