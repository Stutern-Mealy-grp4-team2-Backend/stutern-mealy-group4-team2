import { Router } from "express"
import CartController from "../controllers/cart.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/add", userAuthMiddleWare, tryCatchHandler(CartController.addToCart));
router.post("/applydiscount", userAuthMiddleWare, tryCatchHandler(CartController.applyDiscount));
router.get("/", userAuthMiddleWare, tryCatchHandler(CartController.getUserCart));
router.put("/:productId", userAuthMiddleWare, tryCatchHandler(CartController.removeFromCart));
router.delete("/:productId", userAuthMiddleWare, tryCatchHandler(CartController.deleteProductFromCart));
router.delete("/", userAuthMiddleWare, tryCatchHandler(CartController.emptyCart));


export { router }