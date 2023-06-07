import { Router } from "express"
import AuthController from '../controllers/auth.controller.js';


const router = Router();

router.get('/google', AuthController.googleAuth);
// router.get('/google/login', AuthController.googleLogin);
router.get('/login/google/callback', AuthController.googleCallback);
// router.get('/login/google/callback', googleAuthCallback);


export { router }