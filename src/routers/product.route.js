import { Router } from "express"
import ProductController from "../controllers/product.controller.js";
import FavouriteController from "../controllers/favourite.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import ReviewController from "../controllers/review.controller.js";


const router = Router()

router.post("/create", tryCatchHandler(ProductController.createProduct) )
router.post("/:productId", tryCatchHandler(ProductController.uploadPhoto) )
router.get("/all", tryCatchHandler(ProductController.getAllProducts) )
router.get("/", tryCatchHandler(ProductController.searchProduct) )
router.get("/category", tryCatchHandler(ProductController.searchProductsByCategory) )
router.delete("/all", tryCatchHandler(ProductController.deleteAllProducts) )
router.post("/:productId", userAuthMiddleWare, tryCatchHandler(FavouriteController.addFavourite) )
router.post("/favourites/:productId", userAuthMiddleWare, tryCatchHandler(FavouriteController.addFavourite) )
router.get("/favourites", userAuthMiddleWare, tryCatchHandler(FavouriteController.getFavourites) )
router.delete("/favourites/:favouriteId", userAuthMiddleWare, tryCatchHandler(FavouriteController.removeFavourite) )
router.delete("/favourites", userAuthMiddleWare, tryCatchHandler(FavouriteController.removeAllFavourites) )
router.post("/reviews/create/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.createReview) )
router.get("/allreviews/:productId", tryCatchHandler(ReviewController.getProductReviews) )
router.get("/reviews/:productId", tryCatchHandler(ReviewController.getProductReview) )
router.delete("/reviews/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteReview) )
router.put("/reviews/:reviewId", userAuthMiddleWare, tryCatchHandler(ReviewController.updateReview) )
router.delete("/reviews/delete/:productId", userAuthMiddleWare, tryCatchHandler(ReviewController.deleteAllReviews) )



export { router }













// import express from "express";
// const router = express.Router()

// import ProductController from "../controllers/product.controller.js";
// import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
// //get all product
// router.get("/",ProductController.getAllProduct)
// //search for product
// router.get("/search",ProductController.searchProduct)
// //get available product
// router.get("/availableProduct", ProductController.AvailableProduct)
// //get promotion available
// router.get("/promo", ProductController.promo)
// //get product
// router.get("/:productId", ProductController.getSingleProduct)
// //update product
// router.put("/:productId",userAuthMiddleWare, ProductController.updateProduct)
// //delete product
// router.delete("/:productId",userAuthMiddleWare, ProductController.deleteProduct)
// //create new product
// router.post("/",userAuthMiddleWare,ProductController.createProduct)
// //create a product review
// router.post("/:id/review",userAuthMiddleWare,ProductController.productReview)

// export {router}