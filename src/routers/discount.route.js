import express from "express";
const router = express.Router()
import { tryCatchHandler } from "../utils/tryCatch.handler.js";
import DiscountController from "../controllers/discount.controller.js";


router.post("/",tryCatchHandler(DiscountController.createCoupon))
router.get("/",tryCatchHandler(DiscountController.getCoupon))
router.get("/get_coupons",tryCatchHandler(DiscountController.getAllCoupon))
router.put("/",tryCatchHandler(DiscountController.updateCoupon))
router.delete("/",tryCatchHandler(DiscountController.DeleteCoupon))
router.delete("/delete_coupon",tryCatchHandler(DiscountController.DeleteAllCoupon))

export {router}