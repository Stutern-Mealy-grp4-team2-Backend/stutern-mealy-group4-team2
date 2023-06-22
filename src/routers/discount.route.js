import { Router } from "express"
import DiscountController from "../controllers/discount.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
// import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create", tryCatchHandler(DiscountController.createDiscountCode));
router.get("/", tryCatchHandler(DiscountController.getAllDiscountCodes));
router.put("/:discountId", tryCatchHandler(DiscountController.updateDiscountCode));
router.delete("/:discountId", tryCatchHandler(DiscountController.deleteDiscountCode));



export { router }

