const mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;