import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"


export default class CartController {
    static async addToCart(req, res ) {
        const { cart } = req.body;
        const  userId  = req.user;
        let products = [];
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found');
        // check if user already have product in cart
        const alreadyExistCart = await Cart.findOne( {orderedby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i=0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i].productId;
            object.quantity = cart[i].quantity;
            let getPrice = await Product.findById(cart[i].productId).select("price")
            object.price = getPrice.price;
            products.push(object);
        }
        
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].quantity;
        }
        console.log(products, cartTotal)
        let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy: userId
        }).save();
        res.status(201).json({
            status: 'Success',
            data: newCart
          })
    }

    static async getUserCart(req, res ) {
        const  userId  = req.user;
        if(!userId) throw new NotFoundError('User not found');
        const cart = await Cart.findOne({orderedBy: userId}).populate("products.product");
        res.status(200).json({
            status: 'Success',
            data: cart
          })
    }

    static async emptyCart(req, res ) {
        const userId  = req.user;
        if(!userId) throw new NotFoundError('User not found');
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found');
        const cart = await Cart.findOneAndRemove({orderedBy: userId})
        res.status(200).json({
            status: 'Success',
            message: 'Cart deleted successfully',
            cart
          })
    }
}