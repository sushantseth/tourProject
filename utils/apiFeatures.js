exports.queryFunction = (model, queryObj) => {

    console.log(queryObj)
    let finalqueryObj = {...queryObj}
    const excludedFields = ["page","sort","limit","fields"]
    excludedFields.forEach(el => delete finalqueryObj[el])
    // console.log(queryObj)
    const updatedQuery = JSON.parse(JSON.stringify(finalqueryObj).replace(/\b(gte|gt|lte|lt)\b/g, match => {
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

      let query = model.find(updatedQuery)

      if(queryObj.sort){
        const sortBy = queryObj.sort.split(",").join(" ")
         query = query.sort(sortBy)
      }

      if(queryObj.fields){
        const selectBy = queryObj.sort.split(",").join(" ")
        query = query.select(selectBy)
       }else{
        query = query.select("-createdDate") 
       }

       if(queryObj.limit){
        console.log("inside limit")
       let limit = queryObj.limit ?  queryObj.limit : 3
       let page = queryObj.page ? queryObj.page : 1 
       let skipValue = ( page - 1 ) * 3 
        query =  query.skip(skipValue).limit(limit)
     }
    return query
}
