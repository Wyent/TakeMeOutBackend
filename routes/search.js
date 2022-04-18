
const axios = require('axios')
const { response } = require('express')
const router = require('express').Router()
const yelp = require('yelp-fusion')

const yelpKey = process.env.Yelp_Fusion_Key
const key = process.env.GOOGLE_API_KEY
const Skey = process.env.SEATGEEK_API_KEY
const moviekey = process.env.X_API_KEY
router.post('/', async (req, res, next) => {
    try {
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        const date = req.body.date;
        const keyword = req.body.keyword;
        var indoorOutdoor = req.body.indoorOutdoor;

        // if (indoorOutdoor && (keyword == 'eat' || keyword == 'resturant')) {
        //     const config = {
        //         headers: {
        //           Authorization:
        //             `Bearer ${yelpKey}`,
        //         },
        //         params: {
        //           longitude:longitude,
        //           latitude:latitude
                  
        //         },
        //       };
        //     const { data } = axios.get(`https://api.yelp.com/v3/businesses/search`, config)
        //   console.log(data)
               
           
        // }


        if (indoorOutdoor) {
           
            const { data } = await axios.get(
                `https://api.seatgeek.com/2/events?&datetime_utc=${date}&client_id=${Skey}&lat=${latitude}&lon=${longitude}`
            )
            var result = []
            const object = data
            var details = object.events
            for (let i = 0; i < details.length; i++) {
                var element = details[i]
                let locationC = {lat:element.venue.location.lat, lng:element.venue.location.lon}
                let individual = {
                    name: element.performers[0].name,
                    photoRef: element.performers[0].image,

                    location: locationC,
                    type: element.type,
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