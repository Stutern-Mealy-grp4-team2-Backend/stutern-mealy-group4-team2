import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
import Discount from "../models/discount.model.js"
import { randomString } from "../utils/discount.generator.js"


export default class DiscountController {
    static async createDiscountCode(req, res ) {
        const discountCode = randomString();
        const discount = await new Discount({
           ...req.body,
           discountCode,
           expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
        }).save();
        res.status(201).json({
            status: 'Success',
            data: discount
        })
    }

    static async getAllDiscountCodes(req, res ) {
        const discountCodes = await Discount.find();
        if (discountCodes.length < 1) throw new NotFoundError('No code available');
        res.status(200).json({
            status: 'Success',
            message: `${discountCodes.length} discount codes available`,
            data: discountCodes
        })
    }

    static async updateDiscountCode(req, res ) {
        const id = req.params.discountId
        const validCode = await Discount.findById(id);
        if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
        validCode.discountValue = req.body.discountValue;
        validCode.expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        await validCode.save();
        res.status(200).json({
            status: 'Success',
            data: validCode
        })
    }

    static async deleteDiscountCode(req, res ) {
        const id = req.params.discountId
        const validCode = await Discount.findById(id);
        if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
        const deletedCode = await Discount.findByIdAndDelete(id)
        res.status(200).json({
            status: 'Success',
            data: deletedCode
        })
    }
}