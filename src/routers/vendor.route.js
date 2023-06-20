import { Router } from "express"
import VendorController from "../controllers/vendor.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'


const router = Router()

router.post("/create", tryCatchHandler(VendorController.createVendor));
router.get("/all", tryCatchHandler(VendorController.getAllVendors));
router.get("/search", tryCatchHandler(VendorController.searchVendor));
router.get("/category", tryCatchHandler(VendorController.getVendorsByCategory));
router.get("/:name", tryCatchHandler(VendorController.getAllVendorProducts));
router.delete("/all", tryCatchHandler(VendorController.deleteAllVendors));




export { router }