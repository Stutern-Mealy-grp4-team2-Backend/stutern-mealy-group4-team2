import { Schema, model }  from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
    },

}, {
    timestamps: true
})


export default model("Category", CategorySchema)