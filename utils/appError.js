exports.appError = (message, statusCode) =>{
    let err =  new Error(message)
    err.statusCode = statusCode
    err.status = "fail"
    return err
}