const mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
const User = mongoose.model('User', UserSchema);

module.exports = User;