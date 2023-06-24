import express from "express"
const router = express.Router()
import CartController from "../controllers/cart.controller.js"
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js"


//new cart
router.post("/add-to-cart/:id",CartController.addCart)
router.get("/shopping-cart",CartController.shoppingCart)
router.get("/reduce/:id",CartController.reduceCart)
router.get("/remove/:id",CartController.removeItem)



export {router}