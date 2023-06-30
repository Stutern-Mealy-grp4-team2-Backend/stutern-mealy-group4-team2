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
    static async getAllCoupon(req,res){
        const discount = await Discount.find()
        if(!discount) throw new BadUserRequestError("Coupon not found")
        res.status(201).json(discount)
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
}