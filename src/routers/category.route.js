import { Router } from "express"
import CategoryController from "../controllers/category.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'


const router = Router()

router.post("/create", tryCatchHandler(CategoryController.createCategory));
router.get("/all", tryCatchHandler(CategoryController.getAllCategories));
router.get("/search", tryCatchHandler(CategoryController.searchCategory));




export { router }