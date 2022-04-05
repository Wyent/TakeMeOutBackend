const axios = require('axios')
const router = require('express').Router()
var geohash = require('ngeohash');

const key = process.env.GOOGLE_API_KEY
const Tkey = process.env.TICKETMASTER_API_KEY
const Skey = process.env.SEATGEEK_API_KEY

router.post('/', async (req, res, next) => {
    try {
        const latitude = req.body.latitude;
        const longitude=req.body.longitude;

        const geoPoint = geohash.encode(longitude,latitude)
        console.log(geoPoint)
        const zipCode = req.body.zipCode;
        const date = req.body.date;
        const keyword=req.body.keyword;
        var setting = req.body.setting;
        var city = req.body.tyler;
        console.log("true")

        if (setting === "indoor") {

            const { data } = await axios.get(
                ` https://api.seatgeek.com/2/events?&q=${keyword}&client_id=${Skey}&geoip=true`
            )
            const object = data.events[0]
            res.json(object)

        } else {

            const { data } = await axios.get(
          
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${latitude},${longitude}&radius=5000&keyword=${keyword}`).catch(console.error())


                const object = data.results[0]
                res.json(object)
        }
    }
 catch (err) {
            next(err)
        }
    })

module.exports = router