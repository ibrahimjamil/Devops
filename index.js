const express = require('express')
const mongoose = require('mongoose')
const { MONGO_USER,MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_PORT, REDIS_URL, SESSION_SECRET} = require('./config/config')
const postRouter = require("./routes/postRoutes");
const userRouter = require('./routes/userRoutes')
const redis = require('redis')
const session = require('express-session')
const cors = require('cors')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})
const app = express()

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>console.log("successfully connected to database"))
    .catch((err)=>console.log(err))



app.use(express.json())
app.use(cors({}))
app.enable("trust proxy")
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret:SESSION_SECRET,
      cookie:{
          saveUninitialized: false,
          httpOnly:true,
          maxAge:60000,
          resave: false,
          secure:false
      }
    })
  )

// just to check did node balancer works using nginx 
// app.use("/api/v1",(req,res)=>{
//     console.log("yeah it run")
//     res.send()
// });

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>console.log(`server is listening on port ${PORT}`))