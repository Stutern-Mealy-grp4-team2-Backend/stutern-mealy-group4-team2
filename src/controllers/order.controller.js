
import Order from "../models/order.model.js";
import Product from "../models/product.model.js"
import {BadUserRequestError,UnAuthorizedError} from "../errors/error.js"



export default class OrderController { 
    static async createMealOrder (req,res) {
        const {body:{
            address,
            paymentMethod},params:{productId}
        } = req
        try{
            const  product  = await Product.findById({_id:productId})
            const productTotalPrice = product.discount > 0? product.price - (product.price*(product.discount/100)) : product.price
            if(!product && product.length === 0){
                throw new BadUserRequestError("Product not found")
            }
            const  order  = await Order.findOne({user:req.user._id})
            if(!order || order.length === 0){
                const newOrder = new Order({
                    user: req.user._id,
                    orderItems:[{productId:product._id, quantity: 1}],
                    address,
                    paymentMethod,
                    totalPrice: productTotalPrice//product.price
                })
                const productOrder = await newOrder.save()
                res.status(201).json(productOrder)
            }else{
                const isExisting =  order.orderItems.findIndex(objectId => new String(objectId.productId).trim() == new String(product._id).trim())
                if(isExisting == -1){//if the product does not exist
                    order.orderItems.push({productId:product._id,quantity:1})
                    order.totalPrice += productTotalPrice//product.price
                }else{
                    const existingProductInCart = order.orderItems[isExisting]
                    if(existingProductInCart.isPaid === true || existingProductInCart.isDelivered === true){
                        throw new UnAuthorizedError("This order has been booked already")
                    }
                    existingProductInCart.quantity += 1
                    order.totalPrice  += productTotalPrice//product.price
                }
                const createOrder = await order.save()
                res.status(201).json(createOrder)
            }
            
        }catch(err){
        res.status(500).json({message:err.message})
    }
    }

    //get a single meal order by Id
    static async getMealOrder (req,res) {
        const {orderId} = req.params
    try{
        const order = await Order.findById({_id: orderId}).populate(//populate is used to reference a "ref"
            "user", //user is from the user ref in order model
            "username email" //name and email are from the user model
        )
        if(order){
            res.status(201).json(order)
        }else{
            throw new UnAuthorizedError("Order not found")
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
    }

    //user login to get meal orders
    static async loginMealOrder (req,res) {
        try{
        const order = await Order.find({user: req.user._id})/*.sort({_id: -1})*/
        if(order){
            res.status(201).json(order)
        }else{
            throw new UnAuthorizedError("Order not found")
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
    }
    //get preference meal order
    static async preferOrder (req,res) {
        const {isPaid,isDelivered,location} = req.query
        const preferObj = {}
        try {
            if(isPaid){
                preferObj.isPaid = isPaid
            }
            if(isDelivered){
                preferObj.isDelivered = isDelivered
            }
            if(location){
                preferObj.location = [long, lat]
            }
            const orderPrefer = await Order.find(preferObj)
            if(!orderPrefer || orderPrefer.length === 0){
                throw new BadUserRequestError("You order is empty")
            }
            res.status(200).json(orderPrefer)
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
    //update order after payment
    static async updatePaidOrder (req,res)  {
        const {orderId} = req.params
        try{
        const order = await Order.findById({_id: orderId})
        if(order){
            order.isPaid = true,
            order.paidAt = Date.now(),
            order.paymentResult={
                id:req.body.id,
                status:req.body.status,
                update_time:req.body.update_time,
                email_address:req.body.email_address,
            }
            const updatedOrder = await order.save()
            res.status(201).json(updatedOrder)
        }else{
            throw new UnAuthorizedError("Order not found")
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
    }

     //update order
  static async updateOrder (req,res) {
    try{
    const order = await Order.findByIdAndUpdate({_id:req.params.orderId},{$set:req.body},{
        new: true,
        runValidators: true
    })
    if(!order){
      throw new UnAuthorizedError("Order not found")
    }
    res.status(200).json({
      status:"success",
      message:"Order has been updated"
    })
    }catch(err){
        res.status(500).json({message:err.message})
    }
  }

    //delete order
  static async deleteOrder (req,res) {
    try{
    const order = await Order.findByIdAndDelete(req.params.orderId)
    if(!order){
      throw new UnAuthorizedError("Order not found")
    }
    res.status(200).json({
      status:"success",
      message:"Order has been deleted"
    })
    }catch(err){
        res.status(500).json({message:err.message})
    }
  }
}