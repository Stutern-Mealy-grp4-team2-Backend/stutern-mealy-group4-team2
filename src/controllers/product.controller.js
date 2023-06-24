import Product from "../models/product.model.js"
import Vendor from "../models/vendor.model.js"
import Category from "../models/category.model.js"
import { BadUserRequestError, NotFoundError, FailedRequestError } from "../errors/error.js"
import slugify from "slugify";
import {config} from "../config/index.js";
import path from "path";
import { v2 as cloudinary, uploader } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


export default class ProductController {
  static async createProduct(req, res, next) {
    const { category, vendor } = req.body;
    const isValidVendor = await Vendor.findOne({ name: vendor });
    if (!isValidVendor) throw new BadUserRequestError('Please provide a valid vendor');
    const validCategory = await Category.findOne({ name: category.toLowerCase() });
    if (!validCategory) throw new BadUserRequestError('Please provide a valid category');
  
    if (!req.files || !req.files.file) throw new BadUserRequestError('Please upload a product photo');
    const file = req.files.file;
  
    if (!file.mimetype.startsWith('image')) throw new BadUserRequestError('Please upload the required format');
    if (file.size > config.max_file_upload) throw new BadUserRequestError(`Please upload an image less than ${config.max_file_upload}`);
  
    // Create a custom filename
    file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;
  
    // Move the file to the desired location
    file.mv(`${config.file_upload_path}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new FailedRequestError('Problem with file upload'));
      }
  
      // Create the product with the uploaded photo
      const product = await Product.create({
        ...req.body,
        imageUrl: file.name,
      });
  
      res.status(201).json({
        status: 'Success',
        data: product,
      });
    });
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
    
    // static async productPhotoUpload(req, res, next) {
    //   const Id = req.params.productId;     
    //   // Fetch the user from the database
    //   const product = await Product.findById(Id);
    //   if(!product) throw new BadUserRequestError('Please provide a valid Product ID');
    //   // Update the personal information
    //   if(!req.files) throw new BadUserRequestError('Please upload a product photo');
    //   const file = req.files.file;
    //   if(!file.mimetype.startsWith('image')) throw new BadUserRequestError('Please upload the required format');
    //   // Check file size
    //   if(file.size > config.max_file_upload) throw new BadUserRequestError(`Please upload an image less than ${config.max_file_upload}`);
    //   // Create a custom filename
    //   file.name = `photo_${Id}${path.parse(file.name).ext}`;
      
    //   file.mv(`${config.file_upload_path}/${file.name}`, async err => {
    //     if(err) {
    //       console.error(err);
    //       return next(new FailedRequestError('Problem with file upload'))
    //     }
    //     await Product.findByIdAndUpdate(Id, { imageUrl: file.name })

    //     res.status(200).json({
    //     status: "Success",
    //     message: "Product photo updated successfully",
    //     data: file.name,
    //   })
    //   })
      
    // }

    static async uploadPhoto(req, res, next) {
      const productId = req.params.productId;
    
      // Fetch the product from the database
      const product = await Product.findById(productId);
      if (!product) {
        throw new BadUserRequestError('Please provide a valid Product ID');
      }
    
      // Check if a file was uploaded
      if (!req.files || !req.files.file) {
        throw new BadUserRequestError('Please upload a product photo');
      }
    
      const file = req.files.file;
    
      try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        console.log(result)
    
        // Update the product with the Cloudinary image URL
        await Product.findByIdAndUpdate(productId, { imageUrl: result.secure_url });
    
        // Return the response
        res.status(200).json({
          status: 'Success',
          message: 'Product photo uploaded successfully',
          data: {
            imageUrl: result.secure_url
          }
        });
      } catch (error) {
        // Handle the upload error
        console.error(error);
        next(new FailedRequestError('Problem with file upload'));
      }
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
