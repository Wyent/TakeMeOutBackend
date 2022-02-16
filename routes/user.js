const express=require('express')
const router=express.Router() 
const jwt=require('jsonwebtoken')
const User = require('../models/user')
const bcrypt=require('bcryptjs')
require('dotenv/config')
router.get('/',async (req,res)=>{
    const userList=await User.find()
    if(!userList){
        res.status(500).json({success:false});
    }
    res.send(userList)
})

router.post('/login',async(req,res)=>{
    const secret=process.env.SECRET;
    const user=await User.findOne({email:req.body.email})
    
    if(!user){
        return res.status(400).send('The user not found')

    }
    if(user &&bcrypt.compareSync(req.body.password,user.passwordHash)){
   const token=jwt.sign({
userId:user.id,
isAdmin:user.isAdmin
   },secret,{
       expiresIn:'1d'
   })
   user.token=token;
        res.status(200).send({user:user.email,token:token})

    }else{
        res.status(400).send('password is wrong')  
        }
    
   
})

router.get('/:id',async (req,res)=>{
    const userList=await User.findById(req.params.id).select('-passwordHash')
    if(!userList){
        res.status(500).json({success:false});
    }
    res.send(userList)
})

router.post('/',async (req,res)=>{
   
    let user=new User({
    name:req.body.name,
     email: req.body.email,
     passwordHash:bcrypt.hashSync(req.body.password,10),
   })
   const oldUser = await User.findOne({email:req.body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
   user=await user.save()
   if(!user)
   return res.status(404).send('Category cannt be created')

   res.send(user);
   })

   router.post('/register',async (req,res)=>{
   
    let user=new User({
    name:req.body.name,
     email: req.body.email,
     passwordHash:bcrypt.hashSync(req.body.password,10),
     isAdmin:req.body.isAdmin
   })
   const oldUser = await User.findOne({email:req.body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
   user=await user.save()
   if(!user)
   return res.status(404).send('Category cannt be created')

   res.send(user);
   })

   router.get('/get/count', async(req,res)=>{
      const userCOunt=await User.countDocuments()
      
      if(!userCOunt){
          res.status(500).json({success:false})
      }
      res.send({
          userCount:userCOunt
      })
   })

   module.exports = router;

