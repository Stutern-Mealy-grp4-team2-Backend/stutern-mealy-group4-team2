import BadRequestError from "../../errors/badRequestError.js"
import UnauthorizedError from "../../errors/unAuthorizedError.js"
import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js"
import Product from "../product/ProductModel.js"
import User from "../models/user.model.js"


export default class CartController {
    //create cart
    static async addToCart (req,res) {
      const {params:{productId}} = req
      try {
        const  product  = await Product.findById({_id:productId})
            if(!product && product.length === 0){
                throw new BadUserRequestError("Product not found")
            }
            const  userCart  = await User.findOne({user:req.user._id})
            if(!userCart || userCart.length === 0){
                throw new BadRequestError("Please login to create a cart")
            }
            const shopCart = userCart.addToCart(product)
        res.status(201).json(shopCart)
      } catch (error) {
        res.status(500).json({message:err.message})
      }

    }
    //edit cart
    //view cart
    //delete cart
}