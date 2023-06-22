import { Schema, model, Types, Query }  from "mongoose";

const CartSchema = new Schema({
  products: [
    {
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product'
    },
    price: Number,
  },
],
  
  cartTotal: Number,
  shippingFee: Number,
  vatDeduction: Number,
  cartSubTotal: Number,
  discount: {
    type: Number,
    default: 0
  },
  orderedBy: {
    type: Types.ObjectId,
    ref: 'User',
},
    
}, {
  timestamps: true
})

export default model('Cart', CartSchema)