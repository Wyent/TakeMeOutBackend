
const axios = require('axios')
const router = require('express').Router()


const key = process.env.GOOGLE_API_KEY
const Skey = process.env.SEATGEEK_API_KEY

router.post('/', async (req, res, next) => {
    try {
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        
        const date = req.body.date;
        const keyword = req.body.keyword;
        var indoorOutdoor = req.body.indoorOutdoor;
        
       

        if (indoorOutdoor) {

            const { data } = await axios.get(
                `https://api.seatgeek.com/2/events?&datetime_utc=${date}&client_id=${Skey}&lat=${latitude}&lon=${longitude}`
            )
            var result = []
            const object = data
            var details = object.events
            for (let i = 0; i < details.length; i++) {
                var element = details[i]
                let individual = {
                    name: element.performers[0].name,
                    photoRef: element.performers[0].image,
                    location: element.venue.location,
                    type:element.type,
                    vicinity: element.venue.address
                }
       
                result.push(individual)
            }




            res.json(result)

        } else {

            const { data } = await axios.get(

                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${latitude},${longitude}&radius=5000&keyword=${keyword}`).catch(console.error())

            var result = []
            const object = data
            var details = object.results
            for (let i = 0; i < details.length; i++) {
                var element = details[i]
                let individual = {
                    name: element.name,

                    location: element.geometry.location,
                    rating: element.rating,
                    vicinity: element.vicinity
                }
                var photoRef;
                if (element.photos && Array.isArray(element.photos)) {
                    photoRef = element.photos[0].photo_reference;
                }
                individual.photoRef = photoRef;

                result.push(individual)
            }




            res.json(result)
        }
    }
    catch (err) {
        next(err)
    }
})


module.exports = router