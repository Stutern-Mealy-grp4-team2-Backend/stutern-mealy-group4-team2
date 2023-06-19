import { required } from "joi";
import { Schema, model, Types, Query }  from "mongoose";

const OrderSchema = new Schema({
    orderItems: [{
        type: Types.ObjectId,
        ref: 'OrderItem',
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
    status: {
        type: String,
        enum: ['pending', 'ongoing', 'completed'],
        default: 'pending'
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        Type: Date,
        default: Date.now()
    },
    phone: {
    type: String,
    unique: true,
    required: [true, 'Please add a valid phone']
    },
    notes: String,
    
})

export default model('Order', OrderSchema)
