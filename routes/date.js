const express=require('express')
const router=express.Router() 
const jwt=require('jsonwebtoken')
const Date = require('../models/date')

require('dotenv/config')

router.post('/:id',async (req,res)=>{
  
  let date=new Date({
    user:req.params.id,
    name:req.body.name,
    latitude:req.body.location.lat,
    longitude:req.body.location.lon,
    vicinity:req.body.vicinity,
    photoRef:req.body.photoRef,
  })

  date=await date.save()
res.send("Successful")
})

module.exports=router