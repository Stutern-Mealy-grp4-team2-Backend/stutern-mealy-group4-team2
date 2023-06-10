import { Schema, model, Types }  from "mongoose";

const ReviewSchema = new Schema({
    user: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    text: {
        type: String,
        required: [true, 'Please add some texts'],
    },

    comments: [String],
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not be more than 5'],
        required: [true, 'Please add a rating between 1 and 10']
    },
    product: [{
        type: Types.ObjectId,
        ref: 'Product',
    }],

    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
})

ReviewSchema.pre(/^find/, function (next){
    if (this instanceof Query) {
        this.where({ isDeleted: { $ne: true } }); 
      }  
      next()
});

export default model("Review", ReviewSchema)