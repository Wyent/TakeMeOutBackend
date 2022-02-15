const express=require('express')
const router=express.Router() 
const jwt=require('jsonwebtoken')
const User = require('../models/user')
const bcrypt=require('bcryptjs')
require('dotenv/config')
router.get('/',async (req,res)=>{
  res.send('date found')
})

module.exports=router