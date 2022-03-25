const express=require('express')
const router=express.Router() 
const jwt=require('jsonwebtoken')
const Date = require('../models/date')

require('dotenv/config')
router.post('/',async (req,res)=>{
  let date=new Date({
    user:req.body.user,
    dateDetails:req.body.dateDetails
  })

  date=await date.save()
res.send("Successful")
})

module.exports=router