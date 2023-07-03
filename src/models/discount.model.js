import { Schema, model, Types, Query }  from "mongoose";

const DiscountSchema = new Schema({
    discountCode: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    
}, {
  timestamps: true
})

export default model('Discount', DiscountSchema)