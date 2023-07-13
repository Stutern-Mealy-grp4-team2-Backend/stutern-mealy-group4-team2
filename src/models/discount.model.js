
// import { Schema, model, Types, Query }  from "mongoose";

// const DiscountSchema = new Schema({
//     name: {
//         type: String,
//         trim: true,
//         unique: true,
//         uppercase: true,
//         required: true,
//     },
//     expiry: {
//         type: Date,
//         required: true,
//     },
//     discount: {
//         type: Number,
//         required: true,
//     },
    
// }, {
//   timestamps: true
// })

// export default model('Discount', DiscountSchema)

import mongoose from "mongoose";
const discountSchema = new mongoose.Schema({
    couponCode: String,
    couponValue:Number,
    couponValid: Date,
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps:true})


export default mongoose.model("Discount",discountSchema)

