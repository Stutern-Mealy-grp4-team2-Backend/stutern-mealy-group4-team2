import passport from 'passport';

import { generateToken } from "../utils/jwt.utils.js";

export default class AuthController {
  static async googleAuth(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }


  static async googleCallback(req, res) {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'error',
          message: 'Google authentication failed.',
        });
      }

      // Generate a JWT token for the authenticated user
      const token = generateToken(user)

      // Redirect the user to the desired URL with the token appended as a query parameter
      res.redirect(`http://localhost:5000/dashboard?token=${token}`);
    })(req, res);
  }
}