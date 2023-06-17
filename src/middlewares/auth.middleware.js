import { UnAuthorizedError} from "../errors/error.js"
import {verifyToken} from "../utils/jwt.utils.js"
import passport from 'passport';

export function userAuthMiddleWare(req, res, next){
  const token = req.headers?.authorization?.split(" ")[1];
  if(!token) throw new UnAuthorizedError("You must provide an authorization token.")
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  }catch (err){
    throw new UnAuthorizedError("Access denied, invalid token.")
  }
}

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error || !user) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};