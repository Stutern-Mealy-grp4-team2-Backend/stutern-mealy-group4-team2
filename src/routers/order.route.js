
// import { Router } from "express"
// import OrderController from "../controllers/order.controller.js";
// import { tryCatchHandler } from '../utils/tryCatch.handler.js'
// import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

// const router = Router()

// router.post("/create", userAuthMiddleWare, tryCatchHandler(OrderController.createOrder));
// router.get("/", userAuthMiddleWare, tryCatchHandler(OrderController.getUserOrders));
// router.put("/:orderId", userAuthMiddleWare, tryCatchHandler(OrderController.editOrder));
// router.delete("/:orderId", userAuthMiddleWare, tryCatchHandler(OrderController.deleteOrder));



// export { router }

import express from "express";
const router = express.Router()
import OrderController from "../controllers/order.controller.js";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";



router.put('/deliver/:id',userAuthMiddleWare,OrderController.updateDelivery)
router.get("/:orderId",userAuthMiddleWare,OrderController.getMealOrder)
router.get("/prefer_order",userAuthMiddleWare,OrderController.preferOrder)
router.get("/user_order",userAuthMiddleWare,OrderController.getAllOrder)
router.delete("/:orderId",userAuthMiddleWare,OrderController.deleteOrder)
router.delete("/",userAuthMiddleWare,OrderController.deleteAllOrders)

export {router}

