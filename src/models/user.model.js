import { Schema, model, Types }  from "mongoose";

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
  receivePromotionalEmails: {
    type: Boolean,
    default: false,
  },
  firstName: String,
  lastName: String,
  phone: {
    type: String,
    unique: true,
  },
  countryName: String,
  cityAndState: String,
  numberAndStreet: String,
  postalCode: Number,


//   favourites: [{
//     type: Types.ObjectId,
//     ref: 'Product'
//   }],
  
//   location: {
//     type: {
//       type: String,
//       default: 'Point'
//     },
//     coordinates: [Number]
//   },
//   orders: [{
//     type: Types.ObjectId,
//     ref: 'Order',
// }],
}, {
  timestamps: true
});


UserSchema.index({ location: '2dsphere' });


export default model('User', UserSchema)

