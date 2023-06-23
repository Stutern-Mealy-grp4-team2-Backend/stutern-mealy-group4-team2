import mongoose from "mongoose";
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    orderItems:[
        // product:{
        //     type:String, 
        //     required: true,
        //     ref:"Product"
        // }
        //products:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId ,
                    ref:"Product"
                },
                quantity:{
                    type: Number,
                    default:0
                }
            }
          // ],
        ],
    DeliveryAddress:{type:String, required: true},
    paymentMethod:{
        type:String, 
        required: true
    },
    isPending:{
        type:Boolean,
        default:true
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
        required: true,
        default:false
    },
    paidAt:{
        type: Date
    },
    isDelivered:{
        type:Boolean,
        required: true,
        default:false
    },
    deliverdAt:{
        type: Date
    },
    location:[{
        lat:{
            type: Number,
            default:0,
            required: true
        },
        long:{
            type: Number,
            default:0,
            required: true
        }
    }
    ]
}, {timestamps: true})

export default mongoose.model("Order", orderSchema)