const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxLength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: Array,
      defaule: [],
    },
    category: {
      type: Number,
      default: 1,
    },
    sold: {
      type: Number,
      maxLength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
// TODO: what does this for
productSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    weight: {
      name: 5,
      description: 1,
    },
  }
);
const Product = mongoose.model('Product', productSchema);
module.exports = { Product };
