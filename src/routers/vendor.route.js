import { Router } from "express"
import VendorController from "../controllers/vendor.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'


const router = Router()

router.post("/create", tryCatchHandler(VendorController.createVendor) )
router.get("/search", tryCatchHandler(VendorController.SearchVendor) )
router.get("/all", tryCatchHandler(VendorController.getAllVendors) )


export { router }