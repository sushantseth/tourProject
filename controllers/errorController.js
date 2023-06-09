module.exports = (err, req, res, next) => {
    if(process.env.NODE_ENV === "development"){
    return res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
        stack : err.stack
    })
}else if (process.env.NODE_ENV === "production"){
    return res.status(err.statusCode).json({
        status : err.status,
        message : "something went wrong",
      
    })
}
}