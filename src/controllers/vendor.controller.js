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
    const { name } = req.query
    const vendor = await Vendor.find({name})
    if(vendor.length < 1) throw new NotFoundError(`${name} does not exist`)
    return res.status(200).json({
      status: "Success",
      data: vendor,
    })
  }

  static async getAllVendorProducts(req, res) {
    const name  = req.params.name;
    const vendor = await Vendor.findOne({name})
    if(!vendor) throw new NotFoundError(`${name} does not exist`)

    const products =  await Product.find({ vendor: vendor._id }).populate("vendor")
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

    const products = await Product.find({ category }).select("vendor").populate("vendor");

    if (products.length < 1) {
      throw new NotFoundError("No vendor available in the specified category");
    }

    const vendors = products.map((product) => product.vendor);

    res.status(200).json({
      status: "Success",
      message: `${vendors.length} vendors available`,
      data: vendors,
    });
  }
}