import { Schema, model, Types, Query }  from "mongoose";

const OrderSchema = new Schema({
    orderItems: [{
        type: Types.ObjectId,
        ref: 'Cart',
        required: true
    }],
    deliveryName: String,
    deliveryAddress: {
    type: String,
    min: [5, 'Address must contain at least 5 characters long'],
    // required: [true, 'Please add a valid address']
    },
    scheduledDeliveryTime: Date,

    product: {
    type: Types.ObjectId,
    ref: 'Product',
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'cancelled', 'cash on delievery', 'dispatched', 'completed'],
        default: 'pending'
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    orderedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    totalPrice: Number,
    
    phone: {
    type: String,
    unique: true,
    // required: [true, 'Please add a valid phone']
    },
    notes: String,
    paymentMethod: {
        type: String,
        default: 'online'
    },
    
}, {
    timestamps: true
})

export default model('Order', OrderSchema)

