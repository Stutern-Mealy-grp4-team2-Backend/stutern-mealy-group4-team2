import { Schema, model, Types, Query }  from "mongoose";
import slugify from "slugify";

const ProductSchema = new Schema({
    name: {
        type: String,
        trim: true,
        min: [2, 'Name must be at least 2 characters long'],
        required: [true, 'Please add a name']
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'Please add a price']
    },
    description: {
        type: String,
        validate: {
            validator: function(value) {
              const words = value.split(' ');
              return words.length >= 3;
            },
            message: 'description should have at least 3 words'
          },
        required: [true, 'Please add a description']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not be more than 5'],
    },
    imageUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    vendor: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
    },
    ingredients:{
        type: String,
        validate: {
          validator: function(value) {
            const words = value.split(' ');
            return words.length >= 3;
          },
          message: 'Please provide at least 3 ingredients'
        },
        
    },
    size: String,
    calories: String,
    cookTime: String,
    countInStock: {
        type: Number,
        required: true
    },
    reviews: [{
        type: String,
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: 0
    },
    promoAvailable: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
    

}, {
    timestamps: true
})
ProductSchema.index({ name: 'text', vendor: 'text' });

ProductSchema.pre('save', function (next) {
    this.category = this.category.toLowerCase();
    next();
});
ProductSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
ProductSchema.pre(/^find/, function (next){
    if (this instanceof Query) {
        this.where({ isDeleted: { $ne: true } }); 
      }  
      next()
});


export default model("Product", ProductSchema)



// productSchema.methods.discountPrice = function(/*discountValue*/){
//         const originalPrice = this.name.reduce((total,restaurant) => {
//             const restaurantPrice = restaurant.food.reduce((subtotal, foodItem) => {
//                 return subtotal + foodItem.price
//             })
//             return total + restaurantPrice
//         }, 0)
//         const discountAmount = (this.discount/100)*originalPrice
//         const discountedPrice = originalPrice - discountAmount
//         return parseFloat(discountedPrice.toFixed(2))
//         this.discount = discountValue
//         return this.save()
// }