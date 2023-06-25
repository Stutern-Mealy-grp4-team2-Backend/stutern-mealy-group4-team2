import Product from "../models/product.model.js"
import Vendor from "../models/vendor.model.js"
import Category from "../models/category.model.js"
import { BadUserRequestError, NotFoundError } from "../errors/error.js"
import slugify from "slugify";


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
      const queryObj = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"]
      excludeFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`)
      let query = Product.find(JSON.parse(queryStr))
      // Sorting
      if(req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy)
      } else {
        query = query.sort("-createdAt");
      }
      // Limiting the fields
      if(req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields)
      } else {
        query = query.select('-__v');
      }
      // Pagination
      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if(req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount)  throw new BadUserRequestError('This page does not exist');
      }

      const products = await query
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
