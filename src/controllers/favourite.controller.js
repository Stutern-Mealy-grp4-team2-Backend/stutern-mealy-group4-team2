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
        const existingFavourite = await Favourite.findOne({user, product: id});
        if(existingFavourite) throw new BadUserRequestError('Product already added as favourite');
        const favourite = await Favourite.create( {user, product: availableProduct} )
        res.status(201).json({
        status: "Success",
        data: favourite,
      })
    }
            
    static async getFavourites (req, res) {
      const user = req.user;
      if(!user)throw new NotFoundError('User not found')
      const favourites = await Favourite.find({user}).populate('product');
      if(favourites.length < 1) throw new NotFoundError('No favourite Product'); 
      res.status(200).json({
      status: "Success",
      data: favourites,
      })
    }

    
    static async removeFavourite (req, res) {
      const user = req.user;
      if(!user)throw new NotFoundError('User not found');
      const id = req.params.favouriteId;
      const favourite = await Favourite.findByIdAndRemove(id)
      if(!favourite) throw new NotFoundError('Please select a favourite product'); 
      res.status(200).json({
      status: "Success",
      data: favourite,
      })
    }
    
    static async removeAllFavourites (req, res) {
      const user = req.user;
      if(!user)throw new NotFoundError('User not found');
      const favourites = await Favourite.deleteMany({user})
      if(favourites.length < 1) throw new NotFoundError('No favourite Product'); 
      res.status(200).json({
      status: "Success",
      data: favourites,
      })
    }

}