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
    try{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
    res.status(201).json({total:cart.totalPrice})
    }catch(err){
        res.status(500).json(err)
    }
})
//payment route
router.post("/checkout", (req,res) =>{
    if(!req.session.cart){
        throw new UnAuthorizedError("Access denied")
    }
    const cart = new Cart(req.session.cart)
        stripe.charges.create({
            source: req.body.tokenId,
            amount:req.body.amount,//cart.totalPrice*100,//req.body.amount
            currency:'USD'
        },async (stripeErr,stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            }else{
                 const order = new Order({
                     user:req.user.jwtId,//req.body.user
                     cart:cart,//req.body.cart
                     deliveryAddress:stripeRes.source.address_city,//req.body.address,//from the request body of the stripe
                     name:stripeRes.source.name,//from the request body of the stripe
                     isPaid:stripeRes.paid,
                     totalPrice:stripeRes.amount,
                     paidAt:Date.now(),
                     paymentMethod:stripeRes.payment_method,
                     paymentResult:{
                         id:stripeRes.id,
                         status:stripeRes.status,
                         update_time:Date.now(),
                         email_address:stripeRes.billing_details.email
                     }
                 })
                 await order.save()
                req.session.cart = null;
                res.status(200).json(stripeRes)
              }
         })
    }
)

 export {router}