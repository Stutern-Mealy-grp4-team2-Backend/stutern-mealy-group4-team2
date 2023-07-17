
// import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
// import Discount from "../models/discount.model.js"


// export default class DiscountController {
//     static async createDiscountCode(req, res ) {
//         const discountCode = await new Discount({
//            ...req.body,
//            expiry: Date.now() + 15 * 60 * 60 * 1000,
//         }).save();
//         res.status(201).json({
//             status: 'Success',
//             data: discountCode
//         })
//     }

//     static async getAllDiscountCodes(req, res ) {
//         const discountCodes = await Discount.find();
//         if (discountCodes.length < 1) throw new NotFoundError('No code available');
//         res.status(200).json({
//             status: 'Success',
//             message: `${discountCodes.length} discount codes available`,
//             data: discountCodes
//         })
//     }

//     static async updateDiscountCode(req, res ) {
//         const id = req.params.discountId
//         const validCode = await Discount.findById(id);
//         if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
//         validCode.name = req.body.name;
//         validCode.discount = req.body.discount;
//         validCode.expiry = Date.now() + 24 * 60 * 60 * 1000;
//         await validCode.save();
//         res.status(200).json({
//             status: 'Success',
//             data: validCode
//         })
//     }

//     static async deleteDiscountCode(req, res ) {
//         const id = req.params.discountId
//         const validCode = await Discount.findById(id);
//         if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
//         const deletedCode = await Discount.findByIdAndDelete(id)
//         res.status(200).json({
//             status: 'Success',
//             data: deletedCode
//         })

import Discount from "../models/discount.model.js"
import { BadUserRequestError } from "../errors/error.js"
import { randomNum } from "../utils/randomNum.js"
export default class DiscountController{
    //create coupon
    static async createCoupon(req,res){
        const {couponValue} = req.body
        const discount = new Discount({
            couponCode:randomNum(),
            couponValue,
            couponValid:Date.now() + 7*24*60*60*1000
            
// import { randomString } from "../utils/discount.generator.js"


// export default class DiscountController {
//     static async createDiscountCode(req, res ) {
//         const discountCode = randomString();
//         const discount = await new Discount({
//            ...req.body,
//            discountCode,
//            expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         }).save();
//         res.status(201).json({
//             status: 'Success',
//             data: discount
//
        })
       const newDiscount = await discount.save()
        res.status(201).json(newDiscount)
    }
    //get a single coupon
    static async getCoupon(req,res){
        const {couponCode} = req.body
        const discount = await Discount.findOne({couponCode})
        if(!discount) throw new BadUserRequestError("Coupon not found")
        res.status(201).json(discount)
    }
    //get coupon
    static async getAllCoupon(req, res) {
        const discount = await Discount.find();
        if (!discount) throw new BadUserRequestError("Coupon not found");
      
        const { expiredCoupons, activeCoupons, allCoupons } = req.query;
        const couponObject = {};
      
        if (expiredCoupons) {
          couponObject.expired = discount.filter(coupon => coupon.couponValid < Date.now());
        }
      
        if (activeCoupons) {
          couponObject.active = discount.filter(coupon => coupon.couponValid > Date.now());
        }
      
        if (allCoupons) {
          couponObject.discount = discount;
        }
      
        res.status(200).json(couponObject);
      }
      
    

    //update coupon
    static async updateCoupon(req,res){
        const {couponId} = req.params
        const discount = await Discount.findByIdAndUpdate({_id:couponId},{
            $set:req.body
        },{
            new: true,
            runValidators:true
        })
        if(!discount) throw new BadUserRequestError("Invalid coupon")
        res.status(201).json("Coupon has been updated")
    }

    //delete coupon
    static async DeleteCoupon(req,res){
        const {couponCode} = req.body
        const discount = await Discount.findOneAndDelete({couponCode})
        if(!discount) throw new BadUserRequestError("Invalid coupon")
        res.status(201).json("Coupon has been deleted")
       
    }

    //delete all coupon
    static async DeleteAllCoupon(req,res){
        const discount = await Discount.deleteMany()
        if(!discount) throw new BadUserRequestError("Invalid coupon")
        res.status(201).json("Coupon have been deleted")
    }

//     static async updateDiscountCode(req, res ) {
//         const id = req.params.discountId
//         const validCode = await Discount.findById(id);
//         if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
//         validCode.discountValue = req.body.discountValue;
//         validCode.expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
//         await validCode.save();
//         res.status(200).json({
//             status: 'Success',
//             data: validCode
//         })
//     }

//     static async deleteDiscountCode(req, res ) {
//         const id = req.params.discountId
//         const validCode = await Discount.findById(id);
//         if(!validCode) throw new NotFoundError('Please pass in a valid discount Id');
//         const deletedCode = await Discount.findByIdAndDelete(id)
//         res.status(200).json({
//             status: 'Success',
//             data: deletedCode
//         })
// 
//     }
}


