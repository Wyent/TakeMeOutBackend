const axios = require('axios')
const router = require('express').Router()

const key = process.env.GOOGLE_API_KEY

router.get('/', async (req, res, next) => {
 try {
   const city = 'Tyler'
   const category = 'Park'

   const {data} = await axios.get(
    `https://app.ticketmaster.com/discovery/v2/events.json?&geopoint=9vu0p3k0y4z&apikey=${key}`
// `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+$${city}&type=park&key=${key}`
   )
   
   res.json(data)
   } 
 catch (err) {
  next(err)
}
})

module.exports=router