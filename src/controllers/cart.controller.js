import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"


export default class CartController {
//add to cart by session
static async addCart(req,res){
  console.log("session",req.session)
  const productId = req.params.id
  const cart = new Cart(req.session.cart? req.session.cart : {})
  const product = await Product.findById(productId)
  if(!product){
    throw new BadRequestError("product no found")
  }
  console.log("cart",cart)
  console.log("product",product)
  cart.add(product, product._id)
  req.session.cart = cart;
  console.log("session",req.session.cart)
  res.status(201).json("cart add to session")
}
//reduce cart
static async reduceCart(req,res){
  try {
    const productId = req.params.id
    const cart = new Cart(req.session.cart? req.session.cart : {})
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.status(201).json("Item reduce")
  } catch (err) {
    res.status(500).json(err)
  }
}
//remove all items
static async removeItem (req,res){
  try {
    const productId = req.params.id
    const cart = new Cart(req.session.cart? req.session.cart : {})
    cart.removeItem(productId);
    req.session.cart = cart;
    res.status(201).json("Item removed")
  } catch (err) {
    res.status(201).json(err)
  }
}
//get all cart
static async shoppingCart (req,res){
  console.log("here")
  if(!req.session.cart){
    throw new UnauthorizedError("cart empty")
  }
  console.log("here")
  const cart = new Cart(req.session.cart)
  console.log("here")
  res.status(201).json({
    message:"success",
    data: cart.generateArray(),
    price:cart.totalPrice
  })
}
}