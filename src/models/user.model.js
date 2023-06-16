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
  refreshToken:{
    type:String,
    default:null
  },
  cart:{
    items:[
      {
          productId:{
              type: mongoose.Schema.Types.ObjectId,
              ref:"Product"
          },
          quantity:{
              type: Number,
              default:0
          }
      },
     ],
     totalPrice:{
      type:Number,
      required: true,
      default:0
    }
  },
  verifyEmailToken: String,
  verifyEmailTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
});

UserSchema.methods.addToCart =  function(product){
  let cart = this.cart
  if(cart.items.length == 0){
    cart.items.push({productId:product._id, quantity:1})
    cart.totalPrice = product.price
  }else{
    const isExisting =  cart.item.findIndex(objectId => objectId.productId == product._id)
    if(isExisting == -1){//if the product does not exist
      cart.items.push({productId:product._id,quantity:1})
      cart.totalPrice += product.price
    }else{
      const existingProductInCart = cart.items[isExisting]
      existingProductInCart.quantity += 1
      cart.totalPrice  += product.price
    }
  }
}


export default model('User', UserSchema)