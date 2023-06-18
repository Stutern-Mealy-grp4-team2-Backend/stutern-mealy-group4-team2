import express  from "express";
import  './src/config/passport.js';
import passport from 'passport';
import mongoose from "mongoose";
import morgan from "morgan";
import { router as userRouter } from "./src/routers/user.route.js"

import { router as vendorRouter } from "./src/routers/vendor.route.js"


import { router as authRouter } from "./src/routers/auth.route.js"

import { router as productRouter } from "./src/routers/product.route.js"
 

import { globalErrorHandler } from "./src/utils/errorHandler.js"
import { config } from "./src/config/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express()

// Enable CORS for all routes
app.use(cors());

// Initialize Passport.js middleware
app.use(passport.initialize());

// Use the authentication routes


// Database connection
mongoose.connect(config.mongodb_connection_url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log("Database connection established")).catch(e=> console.log("Mongo connection error: ", e.message))


// Port configuration
const port = config.port || 5000;

// Middlewares
app.use(morgan('tiny'))
app.use(express.json())

//cookie parser middleware
app.use(cookieParser())
// Routes 
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

app.use('/api/v1/vendor', vendorRouter)

app.use('/api/v1/product', productRouter)


//cookie parser middleware
app.use(globalErrorHandler)

// Setting up the express server
app.listen(port, ()=>{
  console.log(`Server running on port: ${port}`)
})