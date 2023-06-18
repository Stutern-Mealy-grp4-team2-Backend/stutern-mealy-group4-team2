import { createUserValidator, loginUserValidator, resetPasswordValidator } from "../validators/user.validator.js"
import { BadUserRequestError, NotFoundError, UnAuthorizedError, FailedRequestError } from "../errors/error.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import {config} from "../config/index.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateToken, refreshToken } from "../utils/jwt.utils.js"
import path from "path";





export default class UserController {

    static async createUser(req, res ) {
      // Joi validation
      const {error} = createUserValidator.validate(req.body)
      if (error) throw error
      const { name, email, password, receivePromotionalEmails } = req.body;
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
      const verifyEmailToken = Math.floor(100000 + Math.random() * 900000).toString();
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
     
      const user = new User ({
      name,
      email,
      password: hashedPassword,
      receivePromotionalEmails,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + config.token_expiry,
      });
      
     await user.save()
       // Set body of email
      const message = `Hi ${name}, Your verification code is: ${verifyEmailToken}`
      
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
      const token = generateToken(user)
      const refresh = refreshToken(user)
      // console.log(refresh)
      user.refreshToken = refresh
      await user.save()
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
      res.status(201).json({
      status: "Success",
      message: 'Account activated successfully.',
      data: {
        user: userData,
        access_token: token
      },
      })
    }

    static async loginUser(req, res) {
      const { error } = loginUserValidator.validate(req.body)
      if (error) throw new BadUserRequestError("Invalid login details");
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password')
      if(!user) throw new UnAuthorizedError("Invalid login details")
      if (!user.isVerified) {
        throw new UnAuthorizedError(`Please login to ${user.email} to activate your account before logging in.`);
      }
      // Compare Passwords
      const isMatch = bcrypt.compareSync(password, user.password)
      if(!isMatch) throw new UnAuthorizedError("Invalid login details")
      const token = generateToken(user)
      const refresh = refreshToken(user)
      // console.log(refresh)
      user.refreshToken = refresh
      await user.save()
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
        status: "Success",
        message: "Login successful",
        data: {
          user: userData,
          access_token: token
        },
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
      const resetPasswordExpire = Date.now() + config.token_expiry;
      // Update user with reset token and expiration date
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();

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
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
      res.status(200).json({
        status: "Success",
        message: "Please input your new password",
      });
    }
    // Update the Password
    static async resetPassword(req, res) {
      const  resetPasswordToken  = req.params.resetPasswordToken;
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) throw new UnAuthorizedError("Invalid or expired reset password token");
      // validate new password
      const { error } = resetPasswordValidator.validate(req.body);
      if (error) throw error;
      // Generate tokens
      const token = generateToken(user)
      const refresh = refreshToken(user)
      // Hash new password
      const saltRounds = config.bycrypt_salt_round;
      user.password = bcrypt.hashSync(req.body.password, saltRounds);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.refreshToken = refresh
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
        status: "Success",
        message: "Password updated successfully",
        data: {
          user: userData,
          access_token: token
        },
      });
    }

      //refresh token handler
  static async refresh (req,res){
    //access cookie to cookies
    const cookies = req.cookies
    //check if cookies exist
    if(!cookies?.refresh_token) return res.status(401).json({
      status:"Failed",
      message:err.message
    })
    const refreshTokenCookie = cookies.refresh_token
    //find from record the cookie user
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    if (!foundUser) return res.sendStatus(403)
    jwt.verify(refreshTokenCookie, config.refresh_secret_key,(err,decoded) => {
        if(err || foundUser._id !== decoded.payload._id) return res.status(403)
        const token = generateToken(foundUser)
        res.status(201).json(token)
    })
  }

  //logout controller
  static async logout (req,res){
    //on the client delete the access token
    //access cookie to cookies
    const cookies = req.cookies;
    //check if cookies exist
    if(!cookies?.refresh_token) return res.sendStatus(204) //no content
    //if there is a cookie in the req
    const refreshTokenCookie = cookies.refresh_token
    //find from db if there is refresh token
    const foundUser = await User.findOne({refreshToken:refreshTokenCookie})
    if(!foundUser) {
    //clear the cookies the cookie though not found in the db
    res.clearCookie("refresh_token",{httpOnly: true, maxAge: config.cookie_max_age})
      return res.sendStatus(204) //successful but not content
    }
    //delete the refresh token in the db
    foundUser.refreshToken = null
    await foundUser.save()
    res.clearCookie("refresh_token",{httpOnly: true, maxAge: config.cookie_max_age})
    res.status(200).json({
    status: 'status',
    message:"Logout successful"
  })
  }

  static async getProfile(req, res,) {
        const userId = req.user._id;
        // if(!userId) throw new UnAuthorizedError('Not authorized')
        // Fetch the user from the database
        const user = await User.findById(userId).select('-_id');
        res.status(200).json({
        status: "Success",
        data: user,
        })
    }

    static async updatePersonalInfo(req, res,) {
        const userId = req.user._id;
        // if(!userId) throw new UnAuthorizedError('Not authorized')
        const { phone, firstName, lastName } = req.body;
        // Fetch the user from the database
        const user = await User.findById(userId);
        // Update the personal information
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        const fullName = firstName + ' ' + lastName;
        user.name = fullName;
        await user.save();
        const userData = user.toObject();
        delete userData._id;
        res.status(200).json({
        status: "Success",
        message: "Personal information updated successfully",
        data: userData,
        })
    }

    static async updateAddressInfo(req, res,) {
        const userId = req.user._id;
        // if(!userId) throw new UnAuthorizedError('Not authorized')
        // Fetch the user from the database
        const user = await User.findById(userId);
        // Update the personal information
        if(!req.files) throw new BadUserRequestError('Please upload a profile photo');
        res.status(200).json({
        status: "Success",
        message: "Address updated successfully",
        data: userData,
        })
    }

    static async profilePhotoUpload(req, res, next) {
      const userId = req.user._id;     
      // Fetch the user from the database
      const user = await User.findById(userId);
      // Update the personal information
      if(!req.files) throw new BadUserRequestError('Please upload a profile photo');
      const file = req.files.file;
      if(!file.mimetype.startsWith('image')) throw new BadUserRequestError('Please upload the required format');
      // Check file size
      if(file.size > config.max_file_upload) throw new BadUserRequestError(`Please upload an image less than ${config.max_file_upload}`);
      // Create a custom filename
      file.name = `photo_${userId}${path.parse(file.name).ext}`;
      
      file.mv(`${config.file_upload_path}/${file.name}`, async err => {
        if(err) {
          console.error(err);
          return next(new FailedRequestError('Problem with file upload'))
        }
        await User.findByIdAndUpdate(userId, { profilePhoto: file.name })

        res.status(200).json({
        status: "Success",
        message: "Profile photo updated successfully",
        data: file.name,
      })
      })
      
  }
    
  static async findDevUser(req, res) {
    const { id } = req.params;
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

  static async findUser(req, res) {
    const { email } = req.params;
    const user = await User.findOne({ email })
    if (!user) throw new NotFoundError('User not found')
    res.status(200).json({
    status: "Success",
    message: "User found",
    
    data:{
      user
      }
    })
  }

  static async guestUser(req, res) {
    res.status(200).json({
    status: "Success",
    message: "Log in successful",
    })
  }

  static async deleteDevUser(req, res) {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id)
    if (!user) throw new NotFoundError('User Not Found')
    res.status(200).json({
    message: `${user.name} with ${user.email} deleted successfully`,
    status: "Success",
    })
  }

  static async findAll(req, res) {
    const users =  await User.find({}, 'name email -_id')
    if(users.length < 1) throw new NotFoundError('No user found')
    res.status(200).json({
      status: "Success",
      data: users
    })
  }

  static async deleteUser(req, res) {
    const { email } = req.params;
    const user = await User.findOneAndRemove({ email });
    if (!user) throw new NotFoundError('User Not Found')
    res.status(200).json({
    message: `${user.name} with ${user.email} deleted successfully`,
    status: "Success",
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
}



    



