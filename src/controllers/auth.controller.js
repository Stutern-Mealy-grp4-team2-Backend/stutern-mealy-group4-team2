import passport from 'passport';

import { generateToken } from "../utils/jwt.utils.js";

export default class AuthController {
  static async googleAuth(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  static async facebookAuth(req, res) {
    passport.authenticate('facebook', { scope: ['email'] })(req, res);
  }

  static async googleCallback(req, res) {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Google authentication failed.',
        });
      }
      res.status(200).json({
        status: 'Success',
        message: `Logged in successfully`,
        user
      })
      
      // // Generate a JWT token for the authenticated user
      // const token = generateToken(user)

      // // Redirect the user to the desired URL with the token appended as a query parameter
      // res.redirect(`http://localhost:5000/dashboard?token=${token}`);
    })(req, res);
  }
  
  static async facebookCallback(req, res) {
    passport.authenticate('facebook', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Facebook authentication failed.',
        });
      }
      res.status(200).json({
        status: 'Success',
        message: `Logged in successfully`,
        user
      })
      
      // // Generate a JWT token for the authenticated user
      // const token = generateToken(user)

      // // Redirect the user to the desired URL with the token appended as a query parameter
      // res.redirect(`http://localhost:5000/dashboard?token=${token}`);
    })(req, res);
  }
}

// export const redirectCallback = (req, res) => {
//   const token = generateToken(user);
//   res.redirect(`http://localhost:3000/dashboard?token=${token}`);
// };