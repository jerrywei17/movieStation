const mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;