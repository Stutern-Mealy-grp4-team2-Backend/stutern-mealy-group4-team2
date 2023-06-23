import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"
import Discount from "../models/discount.model.js";


export default class CartController {
    static async addToCart(req, res) {
        const { cart } = req.body;
        const userId = req.user;
        let products = [];
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError('User not found');
      
        let cartToUpdate = await Cart.findOne({ orderedBy: userId });
      
        if (cartToUpdate) {
          for (let i = 0; i < cart.length; i++) {
            const existingProduct = cartToUpdate.products.find(
              (product) => product.product.toString() === cart[i].productId
            );
      
            if (existingProduct) {
              existingProduct.quantity += parseInt(cart[i].quantity);
            } else {
              let object = {};
              object.product = cart[i].productId;
              object.quantity = parseInt(cart[i].quantity);
              let getPrice = await Product.findById(cart[i].productId).select('price');
              object.price = getPrice.price;
              products.push(object);
            }
          }
      
          cartToUpdate.products = [...cartToUpdate.products, ...products];
      
          let cartSubTotal = 0;
          for (let i = 0; i < cartToUpdate.products.length; i++) {
            cartSubTotal += cartToUpdate.products[i].price * cartToUpdate.products[i].quantity;
          }
      
          let vatDeduction = cartSubTotal * 0.075;
          let shippingFee = 250;
          let cartTotal = cartSubTotal + vatDeduction + shippingFee;
      
          cartToUpdate.cartSubTotal = cartSubTotal;
          cartToUpdate.vatDeduction = vatDeduction;
          cartToUpdate.shippingFee = shippingFee;
          cartToUpdate.cartTotal = cartTotal;
      
          let updatedCart = await cartToUpdate.save();
      
          res.status(200).json({
            status: 'Success',
            data: updatedCart,
          });
        } else {
            // Create new cart
            const products = [];
            let cartSubTotal = 0;
    
            for (let i = 0; i < cart.length; i++) {
                const productId = cart[i].productId;
                const quantity = cart[i].quantity;
                const product = await Product.findById(productId).select('price');
    
                products.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
    
                cartSubTotal += product.price * quantity;
            }
    
            const vatDeduction = cartSubTotal * 0.075;
            const shippingFee = 250;
            const cartTotal = cartSubTotal + vatDeduction + shippingFee;
    
            const newCart = await Cart.create({
                products,
                cartSubTotal,
                vatDeduction,
                shippingFee,
                cartTotal,
                orderedBy: userId
            });
    
            res.status(201).json({
                status: 'Success',
                data: newCart
            });
        }
    }
    static async removeFromCart(req, res) {
        const { productId } = req.params;
        const userId = req.user;
      
        const cartToUpdate = await Cart.findOne({ orderedBy: userId });
      
        if (!cartToUpdate) {
          throw new NotFoundError('Cart not found');
        }
      
        // Find the index of the product to be removed
        const productIndex = cartToUpdate.products.findIndex(
          (product) => product.product.toString() === productId
        );
      
        if (productIndex === -1) {
          throw new NotFoundError('Product not found in cart');
        }
      
        // Remove the product from the products array
        cartToUpdate.products.splice(productIndex, 1);
      
        // Recalculate cart subtotal, vat deduction, shipping fee, and cart total
        let cartSubTotal = 0;
        for (let i = 0; i < cartToUpdate.products.length; i++) {
          cartSubTotal += cartToUpdate.products[i].price * cartToUpdate.products[i].quantity;
        }
      
        let vatDeduction = cartSubTotal * 0.075;
        let shippingFee = 250;
        let cartTotal = cartSubTotal + vatDeduction + shippingFee;
      
        cartToUpdate.cartSubTotal = cartSubTotal;
        cartToUpdate.vatDeduction = vatDeduction;
        cartToUpdate.shippingFee = shippingFee;
        cartToUpdate.cartTotal = cartTotal;
      
        let updatedCart = await cartToUpdate.save();
      
        res.status(200).json({
          status: 'Success',
          data: updatedCart,
        });
      }
      
    static async getUserCart(req, res ) {
        const  userId  = req.user;
        if(!userId) throw new NotFoundError('User not found');
        const user = await Cart.findOne({orderedBy: userId})
        if(!user) throw new NotFoundError('Your cart is empty');
        const cart = await Cart.find({orderedBy: userId}).populate("products.product");
        //const productCount = (cart.products).length;
        res.status(200).json({
            status: 'Success',
           // productCount,
            data: cart
        })
    }

    static async emptyCart(req, res ) {
        const userId  = req.user;
        if(!userId) throw new NotFoundError('User not found');
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found');
        const cart = await Cart.deleteMany({orderedBy: userId})
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

    static async createOrder(req, res ) {
        const { discountCode } = req.body;
        
    }
}
