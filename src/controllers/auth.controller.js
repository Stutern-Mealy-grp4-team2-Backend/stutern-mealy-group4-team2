import passport from 'passport';

import { generateToken, refreshToken } from "../utils/jwt.utils.js"

export default class AuthController {
  static async googleAuth(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  static async facebookAuth(req, res) {
    passport.authenticate('facebook')(req, res);
  }

  static async googleCallback(req, res) {
    passport.authenticate('google', { session: false }, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Google authentication failed.',
        });
      }
      // Generate access and refresh tokens
      const token = generateToken(user);
      const refresh = refreshToken(user);
  
      // Update the user's refresh token in the database
      user.refreshToken = refresh;
      await user.save();
  
      res.status(200).json({
        status: 'Success',
        message: 'Logged in successfully',
        user,
        access_token: token,
        refreshToken: refresh,
      });
  
    })(req, res);
  }
  
  static async facebookCallback(req, res) {
    passport.authenticate('facebook', { session: false }, async(err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Facebook authentication failed.',
        });
      }
      // Generate access and refresh tokens
      const token = generateToken(user);
      const refresh = refreshToken(user);
  
      // Update the user's refresh token in the database
      user.refreshToken = refresh;
      await user.save();
  
      res.status(200).json({
        status: 'Success',
        message: 'Logged in successfully',
        user,
        access_token: token,
        refreshToken: refresh,
      });
  
      
    })(req, res);
  }
}

// export const redirectCallback = (req, res) => {
//   const token = generateToken(user);
//   res.redirect(`http://localhost:3000/dashboard?token=${token}`);
// };