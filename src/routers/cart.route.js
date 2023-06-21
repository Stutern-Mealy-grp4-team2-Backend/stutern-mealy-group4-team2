import express from "express"
const router = express.Router()
import CartController from "../controllers/cart.controller.js"
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js"


router.post("/:productId",userAuthMiddleWare,CartController.addToCart)
router.post("/:productId", CartController.removeFromCart)
router.get("/:productId", CartController.editCart)
router.get("/user",CartController.getCart)
router.get("/delete",CartController.deleteCart)



export {router}