import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"


export default class CartController {
//add to cart by session
static async addCart(req,res){
  const productId = req.params.id
  const cart = new Cart(req.session.cart? req.session.cart : {items:{}})
  const product = await Product.findById(productId)
  if(!product){
    throw new BadUserRequestError("product no found")
  }
  cart.addShippingFee(1000)
  cart.add(product, product._id)
  
  req.session.cart = cart;
  res.status(201).json(req.session.cart)
}
//reduce cart
static async reduceCart(req,res){
  try {
    const productId = req.params.id
    const cart = new Cart(req.session.cart? req.session.cart : {})
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.status(201).json(req.session.cart)
  } catch (err) {
    res.status(500).json(err)
  }
}
//remove all items
static async removeItem (req,res){
  try {
    const productId = req.params.id
    const cart = new Cart(req.session.cart? req.session.cart : {items:{}})
    cart.removeItem(productId);
    req.session.cart = cart;
    res.status(201).json(req.session.cart)
  } catch (err) {
    res.status(201).json(err)
  }
}
//get all cart
static async shoppingCart (req,res){
  if(!req.session.cart){
    throw new UnAuthorizedError("cart empty")
  }
  const cart = new Cart(req.session.cart)
  res.status(201).json({
    message:"success",
    data: cart.generateArray(),
    price:cart.total
  })
}
//delete all shopping cart
static async DeleteCart (req,res){
  if(!req.session.cart){
    throw new UnAuthorizedError("cart empty")
  }
  req.session.cart = null,
  res.status(201).json("cart is empty")
}
//apply coupon
static async applyCoupon (req,res){
  const {couponId} = req.body
    if(!req.session.cart){
      throw new UnAuthorizedError("Cart empty")
    }
    const cart = new Cart(req.session.cart)
    await cart.applyCoupon(couponId,req)
    req.session.cart = cart
    res.status(201).json(req.session.cart)
}
}