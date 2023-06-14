import { Router } from "express"
import ReviewController from "../controllers/review.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'


const router = Router()

router.post("/product/create", tryCatchHandler(ReviewController.createReview) )
router.get("/product/:productId", tryCatchHandler(ReviewController.getProductReviews) )
router.get("/product/:productId", tryCatchHandler(ReviewController.getProductReview) )
// router.get("/category", tryCatchHandler(ProductController.searchProductsByCategory) )


export { router }