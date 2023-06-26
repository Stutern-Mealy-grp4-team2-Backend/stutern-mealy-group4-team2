import { Router } from "express"
import OrderController from "../controllers/order.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create", userAuthMiddleWare, tryCatchHandler(OrderController.createOrder));
router.get("/", userAuthMiddleWare, tryCatchHandler(OrderController.getUserOrders));
router.put("/:orderId", userAuthMiddleWare, tryCatchHandler(OrderController.editOrder));
router.delete("/:orderId", userAuthMiddleWare, tryCatchHandler(OrderController.deleteOrder));



export { router }