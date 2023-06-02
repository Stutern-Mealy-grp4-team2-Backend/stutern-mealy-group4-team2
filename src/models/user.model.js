import { Schema, model }  from "mongoose";
import crypto from "crypto";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    immutable: true,
    validators: {
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyEmailToken: {
    type: String,
    default: null,
  },
  verifyEmailTokenExpire: Date,
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: Date,
}, {
  timestamps: true
})

UserSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

  // Set expire
  // this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  // return resetPasswordToken
}


export default model('User', UserSchema)