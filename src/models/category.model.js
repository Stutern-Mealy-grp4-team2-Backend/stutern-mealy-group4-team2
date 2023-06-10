import { Schema, model, Types }  from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        min: [3, 'Name must be at least 3 characters'],
        max: [3, 'Name must not be more than 10 characters'],
        required: [true, 'Please add a name']
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