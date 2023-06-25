import express from "express"
const router = express.Router()
import { config } from "../config/index.js"
import Stripe from "stripe";
import { UnAuthorizedError } from "../errors/error.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
const stripe = Stripe(config.stripe_secret_keys)

//checkout route
router.get("/checkout",(req,res) =>{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
    res.status(201).json({total:cart.totalPrice})
})
//payment route
router.post("/payment",async (req,res) =>{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
        stripe.charges.create({
            source: req.body.id,
            amount:cart.totalPrice*100,
            currency:'usd'
        },async (stripeErr,stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            }else{
                const order = new Order({
                    user:req.user.jwtId,
                    cart:cart,
                    name:req.body.name,//from the request body of the stripe
                    paymentResult:{
                        id:req.body.stripeRes.id,
                        status:true,
                        update_time:Date.now(),
                        email_address:req.body.email
                    },
                    deliveryAddress:req.body.address,
                    isPaid:Date.now(),
                    paymentMethod:req.body.type
                })
                await order.save()
                req.session.cart = null;
                res.status(200).json(stripeRes)
            }
        })
    }
)
 export {router}