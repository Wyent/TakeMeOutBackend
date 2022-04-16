const { json } = require("express/lib/response")
const axios = require('axios')

function processData(data){
    var output=[]
   
   data=data.results
   console.log(data)
    data.forEach((element) =>{
        var object={
            name:element.name,
            photoRef:element.photos[0].photo_reference,
            location:element.geometry.location,
            rating:element.rating
            
            }
            
        
        output.push(object)
    })
     return output

}

module.exports={processData}