import Product from "../models/product.model.js"
import User from "../models/user.model.js"

import Favourite from "../models/favourite.model.js"
import { UnAuthorizedError, BadUserRequestError, NotFoundError } from "../errors/error.js"
import {Types} from "mongoose";

export default class FavouriteController {
    static async addFavourite (req, res) {
        const id = req.params.productId;
        const user = req.user;
        if(!user)throw new NotFoundError('User not found')
        if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
        const availableProduct = await Product.findById(id)
        if(!availableProduct) throw new BadUserRequestError('Please pass a valid product ID'); 
        const favourite = await Favourite.create( {user, product: availableProduct} )
        res.status(201).json({
        status: "Success",
        data: favourite,
      })
    }
            
    static async getFavourites (req, res) {
      const user = req.user;
      if(!user)throw new NotFoundError('User not found')
      const favourites = await Favourite.find({user})
      if(favourites.length < 1) throw new NotFoundError('No favourite Product'); 
      res.status(200).json({
      status: "Success",
      data: favourites,
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

    static async deleteReviews (req, res) {
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