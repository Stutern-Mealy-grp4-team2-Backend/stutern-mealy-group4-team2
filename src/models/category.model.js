import { Schema, model, Query }  from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        enum: ['African', 'Drinks', 'Salad', 'Combo', 'Starters', 'Snacks'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
})

CategorySchema.pre(/^find/, function (next){
    if (this instanceof Query) {
        this.where({ isDeleted: { $ne: true } }); 
      }  
      next()
});

export default model("Category", CategorySchema)