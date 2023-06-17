import { Schema, model, Types, Query }  from "mongoose";

const ReviewSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    // userId: String,
    text: {
        type: String,
        required: [true, 'Please add some texts'],
    },

    // comments: [String],
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not be more than 5'],
        required: [true, 'Please add a rating between 1 and 10']
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
})
// Prevents users from submitting more than one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

ReviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                rating: { $avg: '$rating' }
            }
        }
    ]);

    
    await this.model('Product').findByIdAndUpdate(productId, {
         rating: obj[0].rating
    })

}

ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.product);
});

ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.product);
});

ReviewSchema.pre(/^find/, function (next){
    if (this instanceof Query) {
        this.where({ isDeleted: { $ne: true } }); 
      }  
      next()
});
