import { UnAuthorizedError} from "../errors/error.js"
import {verifyToken} from "../utils/jwt.utils.js"

export function userAuthMiddleWare(req, res, next){
  const token = req.headers?.authorization?.split(" ")[1];
  if(!token) throw new UnAuthorizedError("You must provide an authorization token.")
  try {
    const payload = verifyToken(token)
    req.user = payload
    console.log("one",req.user)
    next()
  }catch (err){
    throw new UnAuthorizedError("Access denied, invalid token.")
  }
} 