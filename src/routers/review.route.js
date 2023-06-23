import { Router } from "express"
import ReviewController from "../controllers/review.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js';
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/create/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.createReview) )
router.get("/allreviews/:productId", tryCatchHandler(ReviewController.getProductReviews) )
router.get("/:productId", tryCatchHandler(ReviewController.getProductReview) )
router.delete("/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteReview) )
router.delete("/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteReviews) )
router.put("/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.updateReview) )


export { router }