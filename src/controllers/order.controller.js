
import Order from "../models/order.model.js";
import {BadUserRequestError,UnAuthorizedError} from "../errors/error.js"



export default class OrderController { 
     

    //get a single meal order by Id
    static async getMealOrder (req,res) {
        const {orderId} = req.params
    try{
        const order = await Order.findById({_id: orderId})
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
  //delete all order
  static async deleteAllOrders (req,res) {
    try{
    const order = await Order.deleteMany()
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
//get a meal order
  static async getMealOrder (req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  //update delivery of order
static async updateDelivery  (req, res) {
    try {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  //get all user order
  static async getAllOrder (req,res){
    try{
        const orders = await Order.find({user:req.user.jwtId})
        if(!orders || orders.length === 0) throw new BadRequestError("You have no order")
        let cartOrder;
        orders.forEach(function(order){
            cartOrder = new Cart(order.cart)
            order.item = cart.generateArray()
        })
        res.status(201).json({
            message:"success",
            data:orders
        })
    }catch(err){
        res.status(500).json("Failed")
    }
}
}