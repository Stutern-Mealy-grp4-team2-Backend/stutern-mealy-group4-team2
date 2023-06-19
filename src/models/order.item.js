import { Schema, model, Types, Query }  from "mongoose";

const OrderItemSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product'
  }
    
})

export default model('OrderItem', OrderItemSchema)