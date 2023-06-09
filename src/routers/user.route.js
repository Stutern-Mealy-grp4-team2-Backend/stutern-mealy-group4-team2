// Destructure Router from express
import { Router } from "express"
import UserController from "../controllers/user.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/signup", tryCatchHandler(UserController.createUser) )
router.get('/verify/:verifyEmailToken', tryCatchHandler( UserController.verifyUser) );
router.post("/signin", tryCatchHandler( UserController.loginUser) )
router.post("/forgotpassword", tryCatchHandler( UserController.forgotPassword) )
router.post("/resetpassword/code", tryCatchHandler( UserController.resetPasswordCode) )
router.put("/resetpassword/:resetPasswordToken", tryCatchHandler( UserController.resetPassword) )
router.get("/", tryCatchHandler( UserController.findUser) )
router.get("/users", tryCatchHandler( UserController.findAll) )
router.delete("/deleteall", userAuthMiddleWare,tryCatchHandler( UserController.deleteAll) )
router.delete("/deleteuser/:id",userAuthMiddleWare,tryCatchHandler( UserController.deleteUser) )
router.get("/guestlogin", ( UserController.guestUser) )
router.get("/logout",userAuthMiddleWare,tryCatchHandler( UserController.logout) )
router.get("/refresh",userAuthMiddleWare,tryCatchHandler( UserController.refresh) )
router.get("/profile",userAuthMiddleWare,tryCatchHandler(UserController.profile))
router.put("/Profile/:userId",userAuthMiddleWare,tryCatchHandler(UserController.updateProfile))


//Exporting the User Router
export { router }