import express from "express";
const router = express.Router()
import OrderController from "../controllers/order.controller.js";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";



router.put('/deliver/:id',userAuthMiddleWare,OrderController.updateDelivery)
router.get("/:id",userAuthMiddleWare,OrderController.getMealOrder)
router.get("/prefer_order",userAuthMiddleWare,OrderController.preferOrder)
router.get("/user_order",userAuthMiddleWare,OrderController.getAllOrder)

export {router}