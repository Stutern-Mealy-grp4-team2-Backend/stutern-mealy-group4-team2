import mongoose from "mongoose";
const discountSchema = new mongoose.Schema({
    couponCode: String,
    couponValue:Number,
    couponValid: Date,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})


export default mongoose.model("Discount",discountSchema)