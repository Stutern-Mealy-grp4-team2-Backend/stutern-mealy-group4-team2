import { Router } from "express"
import UserController from "../controllers/user.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/", userAuthMiddleWare, tryCatchHandler(UserController.getProfile));
router.put("/personalinfo", userAuthMiddleWare, tryCatchHandler(UserController.updatePersonalInfo));
router.put("/addressinfo", userAuthMiddleWare, tryCatchHandler(UserController.updateAddressInfo));
router.put("/photo", userAuthMiddleWare, tryCatchHandler(UserController.profilePhotoUpload));

export { router }