
const fs = require('fs')
const tourData = JSON.parse(fs.readFileSync(`./data/tourData.json`))

//controller to check the params is valid or not
//this controller will be used in the Router.params middleware which has the fourth value which contains the params value
exports.checkID = (req,res,next,val) => {
    const params = req.params
    const result = tourData.filter((el)=>  el.id === Number(params.id))
    console.log(`params value is ${val}`)
    if(result.length === 0){
    return res.status(404).json({
        status : "success",
        result : {
            tourData : "not found"
        }
    })
}
next()
}


 exports.getTourById = (req,res)=>{
    const params = req.params
    const result = tourData.filter((el)=>  el.id === Number(params.id))
    res.status(200).json({
        status : "success",
        result : {
            tourData : result
        }
    })

}

 exports.addTour = (req,res)=>{
    const body = req.body;
    const tourId = tourData[tourData.length - 1].id + 1
    const responseData = {id : tourId, ...body}
    const updatedData = [responseData, ...tourData]
    console.log(responseData)
    fs.writeFile(`./data/tourData.json`,JSON.stringify(updatedData), (err) =>{
        if(err) res.status(400).json({message : "error occure while writing file"})
         res.status(200).json({
            message:"success",
            data:{
                tour : responseData
            }
        })
    } )
}


exports.checkBody = (req,res,next) => {
    console.log("req.body",req.body)
    if(!req.body.name){
        return res.status(400).json({
            status : "fail",
            result : {
                tourData : "name not provided"
            }
        }) 
    }
    next()
}
