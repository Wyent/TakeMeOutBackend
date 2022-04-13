// const { json } = require("express/lib/response")
// const axios = require('axios')
// const key = process.env.GOOGLE_API_KEY
// const Skey = process.env.SEATGEEK_API_KEY

// async function processData(longitude, latitude, date, keyword, setting) {

//     if (setting === "indoor") {

//         const { data } = await axios.get(
//             ` https://api.seatgeek.com/2/events?&q=${keyword}&client_id=${Skey}&geoip=true`
//         )
//         const object = data.events[0]
//         return object

//     } else {

//         const { data } = await axios.get(

//             `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${latitude},${longitude}&radius=5000&keyword=${keyword}`).catch(console.error())


//         const object = data.results[0]
//         return object
//         }
//     }

//     module.exports = { processData }