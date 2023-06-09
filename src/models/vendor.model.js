import { Schema, model, Types }  from "mongoose";

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
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  
  african: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],
  starters: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],

  drinks: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],

  salad: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],

  combos: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],

  snacks: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviews: [{
      user: {
        type: Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    }],
  }],
  
})
VendorSchema.index({ name: 'text', description: 'text' });

VendorSchema.index({ location: '2dsphere' });

export default model('Vendor', VendorSchema)