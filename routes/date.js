const express = require('express')
const { send } = require('express/lib/response')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Date = require('../models/date')
const dateItems=require('../models/dateitem')
require('dotenv/config')


router.get('/', async (req, res) => {

    var currentUser = req.body.user
    var savedDateList = await Date.findById(req.body.id);
    dateItemslist = savedDateList.dateItems
    var eachdate = []

    Promise.all(dateItemslist.map(async (item) => {
        var savedDateItem = await dateItems.findById(item)
        console.log(savedDateItem)
        eachdate.push(savedDateItem)
    }))
    
    console.log("Lado")
    if (!eachdate) {
        res.status(500).json({ success: false })
    }
    res.send(eachdate)
})


router.post('/', async (req, res) => {
    const dateItemIds = Promise.all(req.body.dateItem.map(async (dateItem) => {
        let newdateItem = new dateItems({
            name: dateItem.name,
            longitude: dateItem.longitude,
            latitude: dateItem.latitude,
            vicinity: dateItem.vicinity,
            photoref: dateItem.photoref
        })

        newdateItem = await newdateItem.save();

        return newdateItem._id;
    }))
    const dateItemIdsfinal = await dateItemIds;


    let date = new Date({
        dateItems: dateItemIdsfinal,
        user: req.body.user,
    })
    date = await date.save();

    if (!date)
        return res.status(400).send('the date cannot be created!')

    res.send(date);
})

module.exports = router