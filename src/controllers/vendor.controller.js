import Vendor from "../models/vendor.model.js"
import { NotFoundError } from "../errors/error.js"

export default class VendorController {
  static async createVendor(req, res,){
      const newVendor = await Vendor.create(req.body)
      res.status(201).json({
      status: "Success",
      newVendor,
    })
  }

  static async SearchVendor(req, res) {
    const { id } = req.query
    const vendors = await Vendor.find(id)
    if(!vendors.length < 1) throw new NotFoundError(`${id} does not exist`)
    return res.status(200).json({
      status: "Success",
      vendors,
    })
  }

  static async getAllVendors(req, res) {
    const vendors = await Vendor.find()
    if(!vendors.length < 1) throw new NotFoundError(`No vendor available. Please check back later`)
    res.status(200).json({
      status: "Success",
      vendors,
    })
  }
}