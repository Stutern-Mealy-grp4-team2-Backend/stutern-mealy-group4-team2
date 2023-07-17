import Product from "../models/product.model.js"

import Review from "../models/review.model.js"
import { UnAuthorizedError, BadUserRequestError, NotFoundError } from "../errors/error.js"
import {Types} from "mongoose";

export default class ReviewController {
    static async createReview (req, res) {
        const { product } = req.body;
        const id = req.params.productId;
        if(id !== product) throw new BadUserRequestError('Please pass a valid product ID')
        const user = req.user;
        if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
        const availableProduct = await Product.findById(id)
        if(!availableProduct) throw new BadUserRequestError('Please pass a valid product ID'); 
        const review = await Review.create({user, ...req.body})
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
      res.status(200).json({
      status: "Success",
      data: review,
      })
    }

    static async getProductReviews (req, res) {
      const id = req.params.productId;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
      const reviews = await Review.find({ product: id })
      if(reviews.length < 1) throw new NotFoundError(`No review found for product with id of ${id}`);
      res.status(200).json({
      status: "Success",
      message: `${reviews.length} reviews available`,
      data: reviews,
      })
    }
    
    
    static async updateReview (req, res) {
      const id = req.params.reviewId;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid review ID')
      const review = await Review.findById(id)
      if(!review) throw new NotFoundError(`Review with Id ${ id } not found`)
      if(review.user.toString() !== req.user._id) throw new UnAuthorizedError('Not authorized to delete this review')
      const {text, rating} = req.body;
      review.text = text;
      review.rating = rating;
      await review.save()
      res.status(200).json({
      status: "Success",
      message: `Review with Id ${ id } updated successfully`,
      review,
    })
  }

    static async deleteReview (req, res) {
        const id = req.params.reviewId;
        if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid review ID')
        const review = await Review.findByIdAndRemove(id)
        if(!review) throw new NotFoundError(`Review with Id ${ id } not found`)
        if(review.user.toString() !== req.user._id) throw new UnAuthorizedError('Not authorized to delete this review')
        res.status(200).json({
        status: "Success",
        message: `Review with Id ${ id } deleted successfully`
      })
    }

    static async deleteAllReviews (req, res) {
      const id = req.params.productId;
      if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid review ID')
      const reviews = await Review.find({product: id})
      if(reviews.length < 1) throw new NotFoundError(`No reviews found`)
      const deletedReviews = await Review.deleteMany({product: id})
      res.status(200).json({
      status: "Success",
      message: `Reviews deleted successfully`
    })
  }
}
