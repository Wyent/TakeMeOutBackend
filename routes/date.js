const express=require('express')
const { send } = require('express/lib/response')
const router=express.Router() 
const jwt=require('jsonwebtoken')
const User = require('../models/user')
const Date = require('../models/date')
const dateItems=require('../models/dateitem')
require('dotenv/config')


router.post('/getdate',async(req,res)=>{

const orderList = await Date.find();
    eachdate=[]
    result=[]
    for(let i=0;i<orderList.length;i++){
        if(orderList[i].user==req.body.user)
eachdate.push(orderList[i].dateItems)
    }
    console.log(eachdate)
    for(let x=0;x<eachdate.length;x++){
        
const retrivedate=await dateItems.findById(eachdate[x])
result.push(retrivedate)
    }
    
    if(!orderList) {
        res.status(404).json({success: false})
    } 
    
    
    console.log(typeof orderList )
    res.send(result);
//    var currentUser=req.body.user
//    var savedDateList=await Date.findById(req.body.id);
// dateItemslist=savedDateList.dateItems
// var eachdate=[]

// dateItemslist.map(async(item)=>{
//     var savedDateItem=await dateItems.findById(item)
//     eachdate.push(savedDateItem)
// })
// console.log(eachdate)
//    if(!eachdate){
//        res.status(500).json({success:false})
//    }
//    res.send(eachdate)
})


router.post('/', async (req,res)=>{
    
  var dateItem=await req.body.dateItem
console.log(dateItem)

      var newdateItem = await new dateItems({
          name:dateItem.name,
          longitude:dateItem.longitude,
          latitude:dateItem.latitude,
          vicinity:dateItem.vicinity,
          photoRef:dateItem.photoRef
      })
console.log(newdateItem)
      newdateItem = await newdateItem.save();

  const dateItemIdsfinal =  await newdateItem._id;

 
  let date = new Date({
      dateItems:dateItemIdsfinal,
      user: req.body.user,
  })
  date = await date.save();

  if(!date)
  return res.status(400).send('the date cannot be created!')

  res.send(date);
})

router.post('/delete', (req, res)=>{
    console.log("Here")
    dateItems.findByIdAndRemove(req.body.dateid).then(
    res.status(200).json({ success: true })).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports=router