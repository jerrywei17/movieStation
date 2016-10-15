const mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;