import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"
import Discount from "../models/discount.model.js";


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
            // let getDiscount = await Product.findById(cart[i].productId).select("discount")
            // object.discount = getDiscount.discount
            products.push(object);
        }
        
        let cartSubTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartSubTotal = cartSubTotal + products[i].price * products[i].quantity;
        }

        // let totalCartDiscount = 0;
        // for (let i = 0; i < products.length; i++) {
        //     totalCartDiscount = totalCartDiscount + products[i].discount * products[i].quantity;
        // }
        
        let vatDeduction = cartSubTotal * 0.075;
        let shippingFee = 250;
        let cartTotal = cartSubTotal + vatDeduction + shippingFee;

        let newCart = await new Cart({
            products,
            cartSubTotal,
            vatDeduction,
            shippingFee,
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

    static async applyDiscount(req, res ) {
        const { discountCode } = req.body;
        const validCode = await Discount.findOne({
            name: discountCode,
            expiry: { $gt: Date.now() },
        });
        if (!validCode) throw new UnAuthorizedError("Invalid or expired discount code");
        const userId  = req.user;
        if(!userId) throw new NotFoundError('User not found');
        const user = await User.findById(userId)
        let { products, cartSubTotal, shippingFee, vatDeduction } = await Cart.findOne({orderedBy: userId}).populate("products.product");
        let discount = validCode.discount;
        let cartTotal = (cartSubTotal + shippingFee + vatDeduction - discount).toFixed(2);
        const newCart = await Cart.findOneAndUpdate(
            { orderedBy: userId },
            { cartTotal, discount },
            { new: true },
        );
        res.status(200).json({
            status: 'Success',
            data: newCart
        })
    }
}
