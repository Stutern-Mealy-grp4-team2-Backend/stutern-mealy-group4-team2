// Destructure Router from express
import { Router } from "express"
import UserController from "../controllers/user.controller.js";
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post("/signup", tryCatchHandler(UserController.createUser) )
router.post('/verify', tryCatchHandler( UserController.verifyUser) );
router.post("/signin", tryCatchHandler( UserController.loginUser) )
router.post("/forgotpassword", tryCatchHandler( UserController.forgotPassword) )
router.put("/resetpassword/:resetPasswordToken", tryCatchHandler( UserController.resetPassword) )
router.get("/", tryCatchHandler( UserController.findUser) )
router.get("/users", tryCatchHandler( UserController.findAll) )
router.delete("/deleteall", tryCatchHandler( UserController.deleteAll) )
router.delete("/deleteuser/:id", tryCatchHandler( UserController.deleteUser) )
router.get("/guestlogin", ( UserController.guestUser) )
router.get("/logout", ( UserController.userLogout) )
//user profile
router.post("/profile",userAuthMiddleWare,UserController.profile)
//update profile
router.put("/Profile/:userId",userAuthMiddleWare,UserController.updateProfile)



//Exporting the User Router
export { router }