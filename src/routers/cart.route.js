import express from "express"
const router = express.Router()
import CartController from "../controllers/cart.controller"


router.get("/",verifyTokenAndAdmin, CartController.getAllCart)
router.post("/:productId", CartController.addToCart)
router.put("/:cartId", CartController.updateCart)
router.get("/:userId", CartController.getCart)
router.delete("/:cartId", CartController.deleteCart)


export {router}