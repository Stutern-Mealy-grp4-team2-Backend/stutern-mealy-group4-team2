import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js";
import User from "../models/user.model.js"
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import {config} from "../config/index.js"


export default class OrderController {
    static async createOrder(req, res) {
        const { shippingAddress, paymentMethod } = req.body;
        const  userId  = req.user;
        const validUser = await User.findById(userId)
        if(!userId) throw new NotFoundError('User not found');
        const user = await Cart.findOne({orderedBy: userId})
        if(!user) throw new NotFoundError('Your cart is empty');
        const cart = await Cart.find({orderedBy: userId}).populate("products.product");
        const orderItems = cart;
        
        const deliveryName = validUser.name;
        // Create the order
        const order = new Order({
            orderItems,
            // products: cart.products,
            // cartSubTotal: cart.cartSubTotal,
            // vatDeduction: cart.vatDeduction,
            // shippingFee: cart.shippingFee,
            // cartTotal: cart.cartTotal,
            // paymentMethod,
            // deliveryAddress,
            orderedBy: userId,
            deliveryName
        });
        
        const createdOrder = await order.save();
        res.status(201).json({
            status: 'Success',
            data: createdOrder,
        });
    }

    static async editOrder(req, res) {
        const { orderId } = req.params;
        const { deliveryAddress, phone, deliveryName, paymentMethod } = req.body;
        const userId = req.user;
        
        // Find the order by its ID
        const order = await Order.findOneAndUpdate(
          { _id: orderId, orderedBy: userId },
          { deliveryAddress, paymentMethod, deliveryName, phone },
          { new: true }
        );
      
        if (!order) throw new NotFoundError('Order not found');
      
        res.status(200).json({
          status: 'Success',
          data: order,
        });
    }

    static async getUserOrders(req, res) {
        const userId = req.user;
        const orders = await Order.find({ orderedBy: userId })
        if (orders.length < 1 ) throw new NotFoundError('Order not found');
        res.status(200).json({
          status: 'Success',
          message: `${orders.length} order available`,
          data: orders,
        });
    }

    static async deleteOrder(req, res) {
        const { orderId } = req.params;
        const userId = req.user;
        if(!userId) throw new NotFoundError('User not found');
        // Find the order by its ID
        const order = await Order.findOneAndDelete({ _id: orderId, orderedBy: userId });
        if (!order) throw new NotFoundError('Order not found');
        
        res.status(200).json({
          status: 'Success',
          message: 'Order deleted',
          order
        });
    }
    static async makePayment(req, res) {
        const { orderId } = req.params;
        const userId = req.user;
      
        // Find the order by its ID
        const order = await Order.findOne({ _id: orderId, orderedBy: userId });
      
        if (!order) {
          throw new NotFoundError('Order not found');
        }
      
        // Perform payment processing logic here...
      
        // Update the order with payment status
        order.isPaid = true;
        order.paidAt = new Date();
      
        // Save the updated order to the database
        const updatedOrder = await order.save();
      
        res.status(200).json({
          status: 'Success',
          data: updatedOrder,
        });
    }

    
}


