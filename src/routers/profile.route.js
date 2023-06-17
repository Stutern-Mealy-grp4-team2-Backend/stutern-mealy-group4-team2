import { Router } from "express"
import UserController from "../controllers/user.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/", userAuthMiddleWare, tryCatchHandler(UserController.getProfile));
router.put("/profile/personalinfo", userAuthMiddleWare, tryCatchHandler(UserController.updatePersonalInfo));
router.put("/profile/addressinfo", userAuthMiddleWare, tryCatchHandler(UserController.updateAddressInfo));

export { router }