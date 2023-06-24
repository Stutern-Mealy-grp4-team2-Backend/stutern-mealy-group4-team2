import express from "express";
const router = express.Router()
import { OrderController } from "../controllers/order.controller.js";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";



//create orders
router.post("/:productId", userAuthMiddleWare, OrderController.createMealOrder)
//get user meal order
router.get("/", userAuthMiddleWare, OrderController.loginMealOrder)
//get prefer order
router.get("/prefer",userAuthMiddleWare, OrderController.preferOrder)
//get order
router.get("/:orderId",userAuthMiddleWare,OrderController.getMealOrder)
//updte order
router.put("/:orderId",userAuthMiddleWare,OrderController.updateOrder)
//delete order
router.delete("/:orderId",userAuthMiddleWare,OrderController.deleteOrder)
//update payment order
router.put("/:orderId/pay",userAuthMiddleWare,OrderController.updatePaidOrder)

export {router}