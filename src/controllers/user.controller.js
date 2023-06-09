import { createUserValidator, loginUserValidator, resetPasswordValidator } from "../validators/user.validator.js"
import { BadUserRequestError, NotFoundError, UnAuthorizedError } from "../errors/error.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import {config} from "../config/index.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateToken,refreshToken } from "../utils/jwt.utils.js"
import crypto from "crypto";





export default class UserController {

    static async createUser(req, res ) {
      // Joi validation
      const {error} = createUserValidator.validate(req.body)
      if (error) throw error
      const { name, email, password } = req.body;
      // Confirm  email has not been used by another user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
      if (existingUser.isVerified) {
      throw new BadUserRequestError(`An account with ${email} already exists.`);
      } else if (existingUser.verifyEmailTokenExpire < Date.now()) {
      // Remove the existing user if the verification token has expired
      await User.deleteOne({ _id: existingUser._id });
      throw new BadUserRequestError('An error occured. Please try signing up again.')
      } else {
      throw new BadUserRequestError(`Please log in to ${email} to get your verification link.`);
      }
}
      // Generate verification token
      const saltRounds = config.bycrypt_salt_round
      // Create verification token
      const token = crypto.randomBytes(20).toString('hex');
      // Hash verification token
      const verifyEmailToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
     
      const user = new User ({
      name,
      email,
      password: hashedPassword,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + config.token_expiry,
      });
      
     await user.save()
      // create verification email URL
      const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/user/verify/${verifyEmailToken}`;
       // Set body of email
      const message = `Hi ${name}, please click on the following link to activate your account: ${verifyEmailUrl}`
      
      const mailSent = await sendEmail({
          email: user.email,
          subject: 'Email verification',
          message
        })
        if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
        res.status(200).json({
          status: 'Success',
          message: `An email verification link has been sent to ${email}.`,
          message
        })
    }
    
    static async verifyUser(req, res) {
      // Extract verification token
      const verifyEmailToken = req.params.verifyEmailToken;      
      // Find the user by the verification token
      const user = await User.findOne({
        verifyEmailToken,
        verifyEmailTokenExpire: { $gt: Date.now() },
      });
      if(!user)  throw new BadUserRequestError('Invalid or expired verification token');
      // Update user's verification status
      user.isVerified = true;
      user.verifyEmailToken = undefined;
      user.verifyEmailTokenExpire = undefined;
      await user.save();
      res.status(201).json({
      status: "Success",
      message: 'Account activated successfully. You can now login.',
      data:{
        user,
        }
      })
    }

    static async loginUser(req, res) {
      const { error } = loginUserValidator.validate(req.body)
      if (error) throw error
      const { email, password } = req.body;
      //if (!email && !password) throw new BadUserRequestError("Please provide a username and email before you can login.")
      const user = await User.findOne({ email }).select('+password')
      //if(!user.isVerified) throw new UnAuthorizedError ('Please verify your account')
      if(!user) throw new UnAuthorizedError("Invalid login details")
      if (!user.isVerified) {
        throw new UnAuthorizedError(`Please login to ${user.email} to activate your account before logging in.`);
      }
      // Compare Passwords
      const isMatch = bcrypt.compareSync(password, user.password)
      if(!isMatch) throw new UnAuthorizedError("Invalid login details")
      const token = generateToken(user)
      const refresh = refreshToken(user)
      user.refreshToken = refresh
      await user.save()
      res.cookie("refresh_token",refresh,{httpOnly: true, maxAge:24*60*60*100})
      res.status(200).json({
        status: "Success",
        message: "Login successful",
        data: {
          user,
          access_token: token
        }
      })
    }

    static async forgotPassword(req, res ) {
      const { email } = req.body;
      // // Confirm  email exists
      const user = await User.findOne({ email })
      if (!user) throw new UnAuthorizedError("Please provide a valid email address")
      // Get reset token
      const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
      // Get reset Expire
      const resetPasswordExpire = Date.now() + 10 * 60 * 1000;
      // Update user with reset token and expiration date
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();
      // create reset URL
      //const resetUrl = `Helloe ${user.name}, Your verification code is: ${resetPasswordToken}`;

      const message = `Hello ${user.name}, Your verification code is: ${resetPasswordToken}`
      
      await sendEmail({
          email:user.email,
          subject: 'Password reset',
          message
        })

        res.status(200).json({
          status: 'Success',
          message: `A password reset link has been sent to ${email}`,
          message
        })

    }
    // Verify the Reset password code  
    static async resetPasswordCode(req, res) {
      const { resetPasswordToken } = req.body;
      console.log(resetPasswordToken)
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      console.log(user)
      if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
      res.status(200).json({
        status: "Success",
        message: "Please input your new password",
      });
    }
    // Update the Password
    static async resetPassword(req, res) {
      const  resetPasswordToken  = req.params.resetPasswordToken;
      console.log(resetPasswordToken)
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
      // validate new password
      const { error } = resetPasswordValidator.validate(req.body);
      if (error) throw error;
      // Hash new password
      const saltRounds = config.bycrypt_salt_round;
      user.password = bcrypt.hashSync(req.body.password, saltRounds);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(200).json({
        status: "Success",
        message: "Password updated successfully",
        data: user,
      });
    }
      

    static async findUser(req, res,) {
      const { id } = req.query
      const user = await User.findById(id)
      if (!user) {
        res.status(400).json({
          status: "Failed",
          message: "User not found"
        })
      }
      res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data:{
        user
        }
      })
    }

    static async guestUser(req, res,) {
      res.status(200).json({
      status: "Success",
      message: "Log in successful",
      })
    }

    static async deleteUser(req, res,) {
      const { id } = req.params.id
      const user = await User.findByIdAndRemove(id)
      if (!user) {
        res.status(400).json({
          status: "Failed",
          message: "User not found"
        })
      }
      res.status(200).json({
      message: "User deleted successfully",
      status: "Success",
      })
    }

    static async findAll(req, res) {
      const users =  await User.find()
      if(users.length < 1) throw new NotFoundError('No user found')
      res.status(200).json({
        status: "Success",
        data: users
      })
    }

    static async deleteAll(req, res) {
      const users =  await User.find()
      if(users.length < 1) throw new NotFoundError('No user found')
      const deleteUsers = await User.deleteMany()
      res.status(200).json({
        status: "All users delete successfully",
      })
    }


      //refresh token handler
  static async refresh (req,res){
    //access cookie to cookies
    const cookies = req.Cookies
    //check if cookies exist
    if(!cookies?.refresh_token) return res.status(401).json({
      status:"Failed",
      message:err.message
    })
    const refreshTokenCookie = cookies.refresh_token
    //find from record the cookie user
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    if (!foundUser) return res.sendStatus(403)
    jwt.verify(refreshTokenCookie,config.refresh_secret_key,(err,decoded) => {
        if(err || foundUser._id !== decoded.payload._id) return res.status(403)
        const token = generateToken(foundUser)
        res.status(201).json(token)
    })
  }

  //logout controller
  static async logout (req,res){
    //on the client delete the access token
    //access cookie to cookies
    const cookies = req.Cookies
    //check if cookies exist
    if(!cookies?.refresh_token) return res.sendStatus(204) //no content
    //if there is a cookie in the req
    const refreshTokenCookie = cookies.refresh_token
    //find from db if there is refresh token
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    if (!foundUser) {
      //clear the cookies the cookie though not found in the db
      res.clearCookie("refresh_token",{httpOnly: true, maxAge:24*60*60*1000})
      return res.sendStatus(204) //successful but not content
    }
    //delete the refresh token in the db
    foundUser.refreshToken = null
    await foundUser.save()
    res.clearCookie("refresh_token",{httpOnly: true, maxAge: 24*60*60*1000})
    res.send(201).json({message:"You have logged out"})
  }
    
}



    



