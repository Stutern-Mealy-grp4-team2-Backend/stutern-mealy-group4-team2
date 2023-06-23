import passport from 'passport';
import { config } from "../config/index.js"
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
      const userData = user.toObject();
      delete userData._id;
      delete userData.password;
      delete userData.googleId;
      const maxAge = parseInt(config.cookie_max_age);
      res.cookie("refresh_token", refresh, { 
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge 
    });
      res.status(200).json({
        status: 'Success',
        message: 'Login successful',
        data: {
          user: userData,
          access_token: token
        },
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
      const userData = user.toObject();
      delete userData._id;
      delete userData.password;
      const maxAge = parseInt(config.cookie_max_age);
      res.cookie("refresh_token", refresh, { 
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge 
    });
    res.status(200).json({
      status: 'Success',
      message: 'Login successful',
      data: {
        user: userData,
        access_token: token
      },
    });

    })(req, res);
  }
}

// export const redirectCallback = (req, res) => {
//   const token = generateToken(user);
//   res.redirect(`http://localhost:3000/dashboard?token=${token}`);
// };