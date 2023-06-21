import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"


export default class CartController {
    //create cart
    static async addToCart (req,res) {
      const {params:{productId}
      } = req
      try{
          const  product  = await Product.findById({_id:productId})
          const productTotalPrice = product.discount > 0? product.price - (product.price*(product.discount/100)) : product.price
          console.log("discount",productTotalPrice)
          if(!product && product.length === 0){
              throw new BadUserRequestError("Product not found")
          }
          const  user  = await User.findById({_id:req.user._id})
          if(!user) throw new UnAuthorizedError("Please sign up to create a cart")
          console.log(user.cart.items)
          if(user.cart.items.length === 0){
              user.cart.items.push({productId:product._id, quantity: 1})
              user.cart.totalPrice = productTotalPrice//product.price
              const updatedUser = await user.save()
              res.status(201).json(updatedUser)
          }else{
              const isExisting =  user.cart.items.findIndex(objectId => new String(objectId.productId).trim() == new String(product._id).trim())
              if(isExisting == -1){//if the product does not exist
                  user.cart.items.push({productId:product._id,quantity:1})
                  user.cart.totalPrice += productTotalPrice//product.price
              }else{
                  const existingProductInCart = user.cart.items[isExisting]
                  existingProductInCart.quantity += 1
                  user.cart.totalPrice  += productTotalPrice//product.price
              }
              const mealCart = await user.save()
              res.status(201).json(mealCart.cart)
          }
          
      }catch(err){
      res.status(500).json({message:err.message})
  }
  }

  // Remove a single product from cart
  static async removeFromCart (req,res){
    const {params:{productId}
  } = req
  try{
      const  product  = await Product.findById({_id:productId})
      const productTotalPrice = product.discount > 0? product.price - (product.price*(product.discount/100)) : product.price
      console.log("discount",productTotalPrice)
      if(!product && product.length === 0){
          throw new BadUserRequestError("Product not found")
      }
      const  user  = await User.findById({_id:req.user.jwtId})
      if(!user) throw new UnAuthorizedError("Please sign up to create a cart")
      console.log(user.cart.items)
      if(user.cart.items.length === 0){
        throw new BadUserRequestError("Cart is empty")
      }else{
          const isExisting =  user.cart.items.findIndex(objectId => new String(objectId.productId).trim() == new String(product._id).trim())
          if(isExisting == -1){//if the product does not exist
            throw new BadUserRequestError("Product not found")
      
          }else{
              const existingProductInCart = user.cart.items[isExisting]
              if(existingProductInCart.quantity === 1){
                user.cart.items.pull(existingProductInCart)
              }else{
                existingProductInCart.quantity -= 1
              }
              user.cart.totalPrice  -= productTotalPrice//product.price
          }
          
          const mealCart = await user.save()
          res.status(201).json(mealCart.cart)
      }
      
  }catch(err){
  res.status(500).json({message:err.message})
}
  }

  //update cart
  static async editCart (req,res) {
    const {params:{productId}
  } = req
  try{
      const  product  = await Product.findById({_id:productId})
      const productTotalPrice = product.discount > 0? product.price - (product.price*(product.discount/100)) : product.price
      console.log("discount",productTotalPrice)
      if(!product && product.length === 0){
          throw new BadUserRequestError("Product not found")
      }
      const  user  = await User.findById({_id:req.user.jwtId})
      if(!user) throw new UnAuthorizedError("Please sign up to create a cart")
      console.log(user.cart.items)
      if(user.cart.items.length === 0){
          throw new UnAuthorizedError("Cart is empty")
      }else{
          const isExisting =  user.cart.items.find(objectId => new String(objectId.productId).trim() == new String(product._id).trim())
          if(isExisting == -1){//if the product does not exist
              throw new BadUserRequestError("Product is not in cart")
          }else{
              user.cart.items.pull(isExisting)
              user.cart.totalPrice  -= productTotalPrice*isExisting.quantity//product.price
          }
          const mealCart = await user.save()
          res.status(201).json(mealCart.cart)
      }
      
  }catch(err){
  res.status(500).json({message:err.message})
}
  }

      //delete cart
static async deleteCart (req,res) {
  try{
    const user = await User.findById({_id:req.user.jwtId})
    if(!user){
      throw new UnAuthorizedError("Please login or register to create a cart")
    }
    user.cart = null;
    await user.save()
    res.status(200).json({
      status:"success",
      message:"Cart empty",
    })
  }catch(err){
    console.log(err)
    res.status(500).json({message:err.message})
  }
}

// find user cart
static async getCart (req,res) {
  try{
  const cart = await User.findById({_id:req.user.jwtId})
  if(!cart){
    throw new UnAuthorizedError("Please login or register to create a cart")
  }
  res.status(200).json({
    status:"success",
    data:cart.cart
  })
}catch(err){
  console.log(err)
  res.status(500).json({message:err.message})
}
}

}