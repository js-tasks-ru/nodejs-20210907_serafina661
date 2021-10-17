const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  category: {required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  subcategory: {required: true, type: mongoose.Schema.Types.ObjectId},
  images: [String],
});

console.log(productSchema);

module.exports = connection.model('Product', productSchema);
