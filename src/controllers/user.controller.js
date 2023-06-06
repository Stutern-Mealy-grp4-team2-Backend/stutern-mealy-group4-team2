import { createUserValidator, loginUserValidator, resetPasswordValidator } from "../validators/user.validator.js"
import { BadUserRequestError, NotFoundError, UnAuthorizedError } from "../errors/error.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import {config} from "../config/index.js"
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js"
import { generateToken } from "../utils/jwt.utils.js"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"





export default class UserController {

    static async createUser(req, res ) {
      // Joi validation
      const {error} = createUserValidator.validate(req.body)
      if (error) throw error
      const { name, email, password } = req.body;
      // Confirm  email has not been used by another user
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        if (existingUser.isVerified) {
          throw new BadUserRequestError(`An account with ${email} already exists.`);
        } else {
          throw new BadUserRequestError(`Please login to ${email} to get your verification link.`);
        }
      }
     
      // Generate verification token
      const saltRounds = config.bycrypt_salt_round
      // Hash verification token
      const verifyEmailToken = Math.floor(1000 + Math.random() * 9000);
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const user = new User ({
      name,
      email,
      password: hashedPassword,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + 15 * 60 * 1000,
      });
      
     await user.save()
      // create reset URL
      // const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/user/verify/${verifyEmailToken}`;
      // Set body of email
      const message = `Your account verification code is: ${verifyEmailToken}`
      
      const mailSent = await sendEmail({
          email: user.email,
          subject: 'Email verification',
          message
        })
        if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
        console.log(mailSent)
        res.status(200).json({
          status: 'Success',
          message: `An email verification link has been sent to ${email}.`,
          message
        })
    }
    
    static async verifyUser(req, res) {
      const verifyEmailToken = req.body.verifyEmailToken;
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
      // Compare Passwords
      const isMatch = bcrypt.compareSync(password, user.password)
      if(!isMatch) throw new UnAuthorizedError("Invalid login details")
      const token = generateToken(user)
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
      const resetPasswordToken = user.getResetPasswordToken();
      
      await user.save({ validateBeforeSave: false })

      // create reset URL
      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetPasswordToken}`;

      const message = `You are receiving this email because you requested for a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`
      
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
// // Validate the new password

    static async resetPassword(req, res,) {
      //Get hashed token
      const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetPasswordToken)
      .digest('hex');
      //const { id } = req.query
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      })
      if (!user) throw new UnAuthorizedError('Unauthorized')
      console.log(user)
      // Set Password
      const { error } = resetPasswordValidator.validate(req.body)
      if (error) throw error
      const saltRounds = config.bycrypt_salt_round
      user.password = bcrypt.hashSync(req.body.password, saltRounds);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      //sendTokenResponse(user, 200, res);
      res.status(200).json({
      status: "Success",
      message: "Password updated successfully",
      data: user
      })
    }


    static async userLogout(req, res,) {
      
      res.status(200).json({
      status: "Success",
      message: "Log out successful"
      })
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


  //user profile
  static async profile (req,res){
    try {
      const user = await User.findById(req.param.userId)
      if(user){
        res.status(200).json({
          name: user.name,
          email: user.email,
        })
      }else{
        res.status(404).json({message:"Sorry, you data is not found, try to register"})
      }
    } catch (err) {
      res.status(404).json({
        status:"Failed",
        message:err.message
      })
    }
  }

  //update user profile
  static async updateProfile (req,res){
    // Joi validation
    const {error} = createUserValidator.validate(req.body)
    if (error) throw error
    try {
      const user = await User.findByIdAndUpdate({_id: req.user._id},
        req.body,{
          new: true,
          runValidators: true
        })
      
      const updateUser = await user.save()
      res.status(200).json({
        name: updateUser.name,
        email: updateUser.email,
        token : generateToken(updateUser)
      })
    } catch (err) {
      res.status(404).json({
        status:"Failed",
        message:err.message
      })
    }
  }

    
}

    

