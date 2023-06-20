import Vendor from "../models/vendor.model.js"
import Product from "../models/product.model.js"
import { BadUserRequestError, NotFoundError } from "../errors/error.js"


export default class VendorController {
  static async createVendor(req, res,){
    const { name, website, phone } = req.body;
    const existingVendor = await Vendor.findOne({
      $or: [
        { name },
        { website },
        { phone }
      ]
    });
    if(existingVendor) throw new BadUserRequestError('Vendor already exists');
      const vendor = await Vendor.create(req.body)
      res.status(201).json({
      status: "Success",
      data: vendor,
    })
  }

  static async searchVendor(req, res) {
    const { name, phone, address, location } = req.query;
    const query = {};
    const products = await Product.find({ vendor: category.toLowerCase() })
    if (address) {
      query.address = { $regex: new RegExp(address, 'i') };
    }

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    if (phone) {
      query.phone = { $regex: new RegExp(phone, 'i') }; // Case-insensitive search
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive search
    }
    const vendors = await Vendor.find(query)
    if(vendors.length < 1) throw new NotFoundError('Vendor not available');
  
    return res.status(200).json({
      status: "Success",
      message: `${vendors.length} vendors available`,
      data: vendors,
    });
  }

  static async getAllVendorProducts(req, res) {
    const name  = req.params.name;
    const vendor = await Vendor.findOne({name})
    if(!vendor) throw new NotFoundError(`${name} does not exist`)

    const products =  await Product.find({ vendor: name }).populate("vendor")
    if (products.length < 1) throw new BadUserRequestError(`${name} does not have any product yet.`);
    return res.status(200).json({
      status: "Success",
      message: `${products.length} products available`,
      data: {
        products,
      }
    })
  }

  static async getAllVendors(req, res) {
    // const vendors = await Vendor.find({}, 'name description phone address -_id')
    const vendors = await Vendor.find()
    if(vendors.length < 1) throw new NotFoundError(`No vendor available. Please check back later`)
    res.status(200).json({
      status: "Success",
      message: `${vendors.length} vendors available`,
      vendors,
    })
  }

  static async getVendorsByCategory(req, res) {
    const { category } = req.query;

    const products = await Product.find({ category: category.toLowerCase() })

    if (products.length < 1) {
      throw new NotFoundError("No vendor available in the specified category");
    }

    const vendors = [...new Set(products.map((product) => product.vendor))];

    res.status(200).json({
      status: "Success",
      message: `${vendors.length} vendors available`,
      data: vendors,
    });
  }

  static async deleteAllVendors(req, res) {
    const vendors = await Vendor.find()
    if(vendors.length < 1) throw new NotFoundError(`No vendor available. Please check back later`)
    await Vendor.deleteMany()
    res.status(200).json({
      status: "All vendors deleted successfully",
    })
  }
}