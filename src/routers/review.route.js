import { Router } from "express"
import ReviewController from "../controllers/review.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js';
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/product/create/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.createReview) )
router.get("/product/all/:productId", tryCatchHandler(ReviewController.getProductReviews) )
router.get("/product/:productId", tryCatchHandler(ReviewController.getProductReview) )
router.delete("/product/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteReview) )

router.delete("/product/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteReviews) )

router.put("/product/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.updateReview) )


export { router }