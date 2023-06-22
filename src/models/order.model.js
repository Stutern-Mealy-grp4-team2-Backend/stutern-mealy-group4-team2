import { Schema, model, Types, Query }  from "mongoose";

const OrderSchema = new Schema({
    orderItems: [{
        type: Types.ObjectId,
        ref: 'Cart',
        required: true
    }],
    
    deliveryAddress: {
    type: String,
    min: [5, 'Address must contain at least 5 characters long'],
    required: [true, 'Please add a valid address']
    },

    product: {
    type: Types.ObjectId,
    ref: 'Product',
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'cancelled', 'cash on delievery', 'dispatched', 'completed'],
        default: 'pending'
    },
    orderedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    totalPrice: Number,
    
    phone: {
    type: String,
    unique: true,
    required: [true, 'Please add a valid phone']
    },
    notes: String,
    paymentMethod: {},
    
}, {
    timestamps: true
})

export default model('Order', OrderSchema)

