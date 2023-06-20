import Product from "../models/product.model.js"
import Vendor from "../models/vendor.model.js"
import Category from "../models/category.model.js"
import { BadUserRequestError, NotFoundError } from "../errors/error.js"
import {Types} from "mongoose";

export default class ProductController {
    static async createProduct (req, res) {
        const { category, vendor } = req.body;
        const isValidVendor = await Vendor.findOne({name: vendor });
        if(!isValidVendor) throw new BadUserRequestError('Please provide a valid vendor');
        const validCategory = await Category.findOne({ name: category.toLowerCase() })
        if(!validCategory) throw new BadUserRequestError('Please provide a valid category');
        const product = await Product.create(req.body)
        res.status(201).json({
        status: "Success",
       data: product,
      })
    }
            
    static async searchProduct (req, res) {
      const { category, vendor, name, location } = req.query;

      const query = {};

      if (category) {
        query.category = { $regex: new RegExp(category, 'i') };
      }

      if (vendor) {
        query.vendor = { $regex: new RegExp(vendor, 'i') };
      }

      if (name) {
        query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
      }

      if (location) {
        query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive search
      }
      const products = await Product.find(query)
      if(products.length < 1) throw new NotFoundError('Product not available');
      res.status(200).json({
      status: "Success",
      message: `${products.length} products available`,
      data: products,
      })
    }
    
    static async getAllProducts (req, res) {
      const products = await Product.find()
      if(products.length < 1) throw new NotFoundError('No Product available');
      res.status(200).json({
      status: "Success",
      message: `${products.length} products available`,
      data: products,
      })
    }

    static async searchProductsByCategory(req, res) {
      const { category } = req.query;
      const products = await Product.find({ category: category.toLowerCase() });
      if (products.length < 1) {
        throw new NotFoundError("No products available in the specified category");
      }
      res.status(200).json({
        status: "Success",
        message: `${products.length} products available`,
        data: products,
      });
    }
  
    static async deleteAllProducts (req, res) {
      const products = await Product.find()
      if(products.length < 1) throw new NotFoundError('No Product available');
      await Product.deleteMany()
      res.status(200).json({
      status: "All products deleted successfully",
    })
    }
}
