const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
require('dotenv/config')
const cors = require("cors")
router.use(cors())
router.get('/', async (req, res) => {
    const userList = await User.find()
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList)
})

router.post('/login', async (req, res) => {
    const secret = process.env.SECRET;
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(400).send('The user not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
        }, secret, {
            expiresIn: '1d'
        })
        user.token = token;
        res.status(200).send({ user: user.email, token: token })

    } else {
        res.status(400).send('password is wrong')
    }
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    const userList = await User.findById(req.params.id).select('-passwordHash')
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList)
})



router.post('/register', async (req, res) => {
const salt=await bcrypt.genSaltSync(10)
password=await req.body.password
    let user = new User({

        email: req.body.email,
        passwordHash:bcrypt.hashSync(password, salt),
        fname: req.body.fname,
        lname: req.body.lname
        
    })
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }
    user = await user.save()
    if (!user)
        return res.status(404).send('Category cannt be created')

    res.send(user);
})

router.get('/get/count', async (req, res) => {
    const userCOunt = await User.countDocuments()

    if (!userCOunt) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCOunt
    })
})

router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
        email: req.body.email,
        passwordHash: newPassword,
        fname: req.body.fname,
        lname: req.body.lname
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')
console.log(user)
    res.send(user);
})


module.exports = router;

