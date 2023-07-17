
// import { Schema, model, Types, Query }  from "mongoose";

// const OrderSchema = new Schema({
//     orderItems: [{
//         type: Types.ObjectId,
//         ref: 'Cart',
//         required: true
//     }],
//     deliveryName: String,
//     deliveryAddress: {
//     type: String,
//     min: [5, 'Address must contain at least 5 characters long'],
//     // required: [true, 'Please add a valid address']
//     },
//     scheduledDeliveryTime: Date,

//     product: {
//     type: Types.ObjectId,
//     ref: 'Product',
//     },
//     orderStatus: {
//         type: String,
//         enum: ['pending', 'processing', 'cancelled', 'cash on delievery', 'dispatched', 'completed'],
//         default: 'pending'
//     },
//     isDelivered: {
//         type: Boolean,
//         default: false,
//     },
//     isPaid: {
//         type: Boolean,
//         default: false,
//     },
//     paidAt: Date,
//     orderedBy: {
//         type: Types.ObjectId,
//         ref: 'User',
//     },
//     totalPrice: Number,
    
//     phone: {
//     type: String,
//     unique: true,
//     // required: [true, 'Please add a valid phone']
//     },
//     notes: String,
//     paymentMethod: {
//         type: String,
//         default: 'online'
//     },
    
// }, {
//     timestamps: true
// })

// export default model('Order', OrderSchema)


import mongoose from "mongoose";
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    cart:{type:Object, 
        required: true
    },
    DeliveryAddress:{type:String},
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
        //required: true,
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
    deliveredAt:{
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

