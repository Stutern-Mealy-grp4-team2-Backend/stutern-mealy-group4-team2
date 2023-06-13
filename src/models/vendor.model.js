import { Schema, model, Types, Query }  from "mongoose";

const VendorSchema = new Schema({
  name: {
    type: String,
    unique: true,
    min: [3, 'Name must be at least 3 characters long'],
    max: [20, 'Name must not be more than 20 characters long'],
    required: [true, 'Please add a name']
  },
  description: {
    type: String,
    validate: {
      validator: function(value) {
        const words = value.split(' ');
        return words.length >= 3;
      },
      message: 'description must contain at least 3 words'
    },
    required: [true, 'Please add a description']
  },
  address: {
    type: String,
    min: [5, 'Address must contain at least 5 characters long'],
    required: [true, 'Please add a valid address']
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
},
  vendorID: String,
  // location: {
  //   type: {
  //     type: String,
  //     default: 'Point',
  //     // required: true,
  //   },
  //   coordinates: {
  //     type: [Number],
  //     // required: true,
  //   },
  //   // formattedAddress: String,
  //   // street: String,
  //   // city: String,
  //   // state: String,
  //   // zipcode: String,
  // },
  website: {
    type: String,
    unique: true,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please add a valid URL with HTTP or HTTPS']
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'Please add a valid phone']
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
  },
  
  
})
VendorSchema.index({ name: 'text', description: 'text' });

VendorSchema.index({ location: '2dsphere' });

VendorSchema.pre(/^find/, function (next){
  if (this instanceof Query) {
      this.where({ isDeleted: { $ne: true } }); 
    }  
    next()
});

export default model('Vendor', VendorSchema)
