import Product from "../models/product.model.js"
import Review from "../models/review.model.js"
import { UnAuthorizedError, BadUserRequestError, NotFoundError } from "../errors/error.js"
import {Types} from "mongoose";

export default class ReviewController {
    static async createReview (req, res) {
        const { product, user} = req.body;
        req.params.productId = product;
        const availableProduct = await Product.findById({product})
        if(!availableProduct) throw new BadUserRequestError('Please pass a valid product ID'); 
        const review = await Review.create(req.body)
        res.status(201).json({
        status: "Success",
        data: review,
      })
    }
            
    static async getProductReview (req, res) {
      const id = req.params.productId;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
      const review = await Review.findById({product: id})
      if(!review) throw new NotFoundError(`No review found for product with id of ${id}`);
      res.status(201).json({
      status: "Success",
      data: review,
      })
    }

    static async getProductReviews (req, res) {
      const id = req.params.productId;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
      const reviews = await Review.find({product: id})
      if(reviews.length < 1) throw new NotFoundError(`No review found for product with id of ${id}`);
      res.status(201).json({
      status: "Success",
      message: `${reviews.length} reviews available`,
      data: reviews,
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

    static async searchProductsByCategory(req, res) {
      const { category } = req.query;
      const products = await Product.find({ category });
      if (products.length < 1) {
        throw new NotFoundError("No products available in the specified category");
      }
      res.status(200).json({
        status: "Success",
        data: products,
      });
    }
  
}
