import { Schema, model, Types, Query }  from "mongoose";

const FavouriteSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    
}, {
  timestamps: true
})

export default model('Favourite', FavouriteSchema)