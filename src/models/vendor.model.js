import { Schema, model }  from "mongoose";

const VendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
})


export default model('Vendor', VendorSchema)