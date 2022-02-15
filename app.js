const express=require('express')
const app=express()
require('dotenv/config')
const morgan=require('morgan')
const mongoose=require('mongoose')
const cors=require('cors')
const api=process.env.API_URL
const authJwt=require('./helpers/jwt')
const errorHandler=require('./helpers/errorhandler')

//Middleware

app.use(express.json())
app.use(morgan('tiny'))
app.options('*',cors())
app.use(authJwt())

app.use(errorHandler)

//routes
const UserRouter=require('./routes/user')
const dateRouter=require('./routes/date')
const res = require('express/lib/response')
app.use(`${api}/users`,UserRouter)
app.use(`${api}/date`,dateRouter)

mongoose.connect(process.env.CONNECT_STR,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'userTable'
})
.then(()=>{
    console.log('Connection Ready')
})
.catch((err)=>{
    console.log(err);
})




app.listen(3000,()=>{
    console.log(api)
    console.log("server is running")
})

