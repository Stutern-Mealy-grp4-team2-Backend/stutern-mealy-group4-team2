import mongoose from "mongoose";
const discountSchema = new mongoose.Schema({
    couponCode: String,
    couponValid: Date,
    couponExpires: Date
},{timestamps:true})


export default mongoose.model("Discount",discountSchema)