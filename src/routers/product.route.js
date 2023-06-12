import { Router } from "express"
import ProductController from "../controllers/product.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'


const router = Router()

router.post("/create", tryCatchHandler(ProductController.createProduct) )
router.get("/", tryCatchHandler(ProductController.getSingleProduct) )
router.get("/search", tryCatchHandler(ProductController.SearchVendor) )



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