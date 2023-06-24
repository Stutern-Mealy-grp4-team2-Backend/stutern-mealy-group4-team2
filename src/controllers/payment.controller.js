import express from "express"
const router = express.Router()
import { config } from "../config/index.js"
import Stripe from "stripe";
const stripe = Stripe(config.stripe_secret_keys)

router.post("/payment",(req,res) =>{
        stripe.charges.create({
            source: req.body.tokenId,
            amount:req.body.amount,
            currency:'usd'
        },(stripeErr,stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            }else{
                res.status(200).json(stripeRes)
            }
        })
    }
)
 export {router}