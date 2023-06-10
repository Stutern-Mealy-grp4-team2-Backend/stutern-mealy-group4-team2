import { Schema, model, Types }  from "mongoose";

const VendorSchema = new Schema({
  name: {
    type: String,
    min: [3, 'Name must be at least 3 characters'],
    max: [3, 'Name must not be more than 10 characters'],
    required: [true, 'Please add a name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  location: {
    type: {
      type: String,
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  website: {
    type: String,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please add a valid URL with HTTP or HTTPS']
  },
  phone: {
    type: String,
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




// african: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],
//   starters: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],

//   drinks: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],

//   salad: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],

//   combos: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],

//   snacks: [{
//     name: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     rating: {
//       type: Number,
//       required: [true, 'Please add a name']
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Please add a name']
//     },
//     reviews: [{
//       user: {
//         type: Types.ObjectId,
//         ref: 'User',
//       },
//       comment: String,
//       rating: Number,
//     }],
//   }],