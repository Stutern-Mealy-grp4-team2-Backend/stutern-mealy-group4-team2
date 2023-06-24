import mongoose from "mongoose";
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    cart:{type:Object, required: true},
    DeliveryAddress:{type:String, required: true},
    paymentMethod:{
        type:String, 
        required: true
    },
    paymentResult:{
        id:{type:String},
        status:{type:String},
        update_time:{type:String},
        email_address:{type:String},
    },
    shippingFee:{
        type:Number,
        default:500
    },
    totalPrice:{
        type:Number,
        required: true,
        default:0.0
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:{
        type: Date
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    delivereddAt:{
        type: Date
    },
    location:[{
        lat:{
            type: Number,
            default:0,
        },
        long:{
            type: Number,
            default:0,
        }
    }
    ]
}, {timestamps: true})

export default mongoose.model("Order", orderSchema)
