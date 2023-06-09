import { Schema, model }  from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: function() {
      // Make the password field required unless googleId or facebookId is present
      return !(this.facebookId);
    },
    unique: true,
    lowercase: true,
    immutable: true,
    validators: {
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
    }
  },
  password: {
  type: String,
  required: function() {
    // Make the password field required unless googleId or facebookId is present
    return !(this.facebookId || this.googleId);
  },
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken:{
    type:String,
    default:null
  },
  verifyEmailToken: String,
  verifyEmailTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  googleId: String,
  facebookId: String,
}, {
  timestamps: true
});


export default model('User', UserSchema)

