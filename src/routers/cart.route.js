import express from "express"
const router = express.Router()
import CartController from "../controllers/cart.controller.js"


router.post("/:productId", CartController.addToCart)
router.post("/:productId", CartController.removeFromCart)
router.get("/:productId", CartController.editCart)
router.get("/user",CartController.getCart)
router.get("/delete",CartController.deleteCart)



export {router}