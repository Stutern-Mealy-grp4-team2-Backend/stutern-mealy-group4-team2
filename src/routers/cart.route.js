import { Router } from "express"
import CartController from "../controllers/cart.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import DiscountController from "../controllers/discount.controller.js";

const router = Router()

router.post("/add/:productId/:quantity", userAuthMiddleWare, tryCatchHandler(CartController.addToCart));
router.get("/", userAuthMiddleWare, tryCatchHandler(CartController.getUserCart));
router.put("/:productId/:quantity", userAuthMiddleWare, tryCatchHandler(CartController.removeFromCart));
router.delete("/:productId", userAuthMiddleWare, tryCatchHandler(CartController.deleteProductFromCart));
router.delete("/", userAuthMiddleWare, tryCatchHandler(CartController.emptyCart));
router.post("/discount/create", tryCatchHandler(DiscountController.createDiscountCode));
router.post("/discount/apply", userAuthMiddleWare, tryCatchHandler(CartController.applyDiscount));
router.get("/discount", tryCatchHandler(DiscountController.getAllDiscountCodes));
router.put("/discount/update/:discountId", tryCatchHandler(DiscountController.updateDiscountCode));
router.delete("/discount/:discountId", tryCatchHandler(DiscountController.deleteDiscountCode));

export { router }