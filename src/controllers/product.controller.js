import Product from "../models/product.model.js"
import Vendor from "../models/vendor.model.js"
import { UnAuthorizedError, BadUserRequestError, NotFoundError } from "../errors/error.js"
import {Types} from "mongoose";

export default class ProductController {
    static async createProduct (req, res) {
        const id = req.body.vendor_id;
        if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid vendor ID')
        const { category } = req.body;
        if(!Product.schema.path('category').enumValues.includes(category)) throw new BadUserRequestError('Please provide a valid category');
        const product = await Product.create(req.body)
        res.status(201).json({
        status: "Success",
       data: product,
      })
    }
            
    static async getSingleProduct (req, res) {
      const id = req.query.product_id;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid vendor ID')
      const product = await Product.findById(id)
      if(!product) throw new NotFoundError('Product not available');
      res.status(201).json({
      status: "Success",
      data: product,
      })
    }
    
    static async getAllProducts (req, res) {
      const products = await Product.find()
      if(products.length < 1) throw new NotFoundError('No Product available');
      res.status(201).json({
      status: "Success",
      data: products,
      })
    }
}



// export default class ProductController{
//     //get all products
//     static async getAllProduct (req,res) {
//         try{
//         const product = await Product.find({})
//         if(!product){
//             throw new BadUserRequestError("Sorry, we dont have any product")
//         }
//         res.status(200).json({
//             status:"Success",
//             data:product
//         })
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//     }

//     //get single product
//     static async getSingleProduct (req,res){
//         const {productId} = req.params
//         try {
//             const product = await Product.find({_id:productId})
//             if(!product){
//                 throw new BadUserRequestError("Sorry, we dont have meal again. Check back later")
//             }
//             res.status(200).json({
//                 status:"Success",
//                 data:product
//          })
//         } catch (err) {
//             res.status(500).json({message:err.message})
//         }
//     }
//     //Get all availabe product
//     static async AvailableProduct (req,res) {
//         try{
//         const product = await Product.find({})
//         const newPro = product.find((prod) =>{
//             return prod.featured === true
//         })
//         if(!product){
//             throw new BadUserRequestError("This meal is not available")
//         }
//         res.status(200).json({
//             status:"Success",
//             data: newPro
//         })
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//     }
    
//     //select promotion offer
//         static async promo (req,res) {
//             try{
//             const product = await Product.find({})
//             if(!product){
//                 throw new BadUserRequestError("This meal is not available")
//             }
//             const newPro = product.filter((prod) =>{
//                 return prod.promoAvailable === true
//             })
//             if(!newPro || newPro.length === 0){
//                 throw new BadUserRequestError("We don't have promotion for now")
//             }
//             res.status(200).json({
//                 status:"Success",
//                 data: newPro
//             })
//         }catch(err){
//             res.status(500).json({message:err.message})
//         }
//         }
//     //search for a product
//     static async  searchProduct (req,res){
//         try {
//             const {restaurant, food, drink} = req.query
//             const queryObject = {}
//             if(restaurant){
//                 queryObject['name.restaurant'] = {$regex: restaurant, $options: 'i'}
//             }
//             if(food){
//                 queryObject['name.food.name'] = {$regex: food, $options: 'i'}
//             }
//             if(drink){
//                 queryObject['name.drink.name'] = {$regex: drink, $options: 'i'}
//             }
//             const product = await Product.find(queryObject)
//             if(!product || product.length === 0){
//                 throw new BadUserRequestError("Product not found")
//             }
//             res.status(200).json({
//                 status:"Success",
//                 data:product
//             })
//         } catch (err) {
//             res.status(500).json({msg:err.message})
//         }
//     }


//     //create product
//     static async createProduct (req,res) {
//         try{
//             console.log('one')
//         const product = new Product(req.body)
//         console.log('one',product)
//         const newProduct = await product.save()
//         if(!newProduct){
//             throw new BadUserRequestError("No product created")
//         }
//         res.status(201).json({
//             data: newProduct
//         })
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//     }

//     //update product
//     static async updateProduct (req,res) {
//         try{
//             console.log("one")
//         const newProduct = await Product.findByIdAndUpdate(req.params.productId,{
//             $set:req.body
//         },{
//             new: true,
//             runValidators: true
//         })
//         if(!newProduct){
//             throw new BadUserRequestError("No product created")
//         }
//         res.status(201).json({
//             data: newProduct
//         })
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//     }
//     //delete product
//   static async deleteProduct (req,res) {
//     try{
//     const product = await Product.findByIdAndDelete(req.params.id)
//     if(!product){
//       throw new UnAuthorizedError("Product not found")
//     }
//     res.status(200).json({
//       status:"success",
//       message:"Product has been deleted"
//     })
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//   }
//     //create product review
//     static async productReview (req,res) {
//         try{
//         const {rating, comment} = req.body
//         const product = await Product.findById({_id:req.params.id})
//         if(product){
//             const alreadyReviewed = product.reviews.find(
//                 (r) => r.user.toString() === req.user._id.toString()
//             )
//             if(alreadyReviewed){
//                 throw new UnAuthorizedError("Product review already exist")
//             }
//             const review = {
//                 name: req.user.name,
//                 rating: Number(rating),
//                 comment,
//                 user: req.user._id
//             }
//             product.reviews.push(review)
//             product.numReview = product.reviews.length
//             product.rating = product.reviews.reduce((acc,item) => item.rating + acc, 0)/product.reviews.length
//             await product.save()
//             res.status(201).json({message:"Review added"})
//         }else{
//             throw new BadUserRequestError("Product review failed")
//         }
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
//     }
// }