const Movie = require('../models/movie');
const Category = require('../models/category');
const Comment = require('../models/comment');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

exports.detail = function(req, res) {
	var id = req.params.id;
	Movie.update({
		_id: id
	}, {
		$inc: {
			pv: 1
		}
	}, function(err) {
		if (err) {
			console.log(err);
		}
	});
	Movie.findById(id, function(err, movie) {
		Comment
			.find({
				movie: id
			})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render('detail', {
					title: 'imooc ' + movie.title,
					movie: movie,
					comments: comments
				})
			});
	});
};



exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin', {
			title: 'imooc 后台錄入頁',
			movie: {},
			categories: categories
		})
	})
};

exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;
				next();
			});

		});

	} else {
		next();
	}
}

exports.save = function(req, res) {
	var id = req.body.movie.id;
	var movieObj = req.body.movie;

	var _movie;
	if (req.poster) {
		movieObj.poster = req.poster;
	}

	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie.id);
			});
		});
	} else {
		_movie = new Movie(movieObj);

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			var categoryId = movieObj.category;
			var categoryName = movieObj.categoryName;
			if (categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie.id);
					category.save(function(err, category) {
						res.redirect('/movie/' + movie.id);
					});
				});
			} else if (categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie.id]
				});
				category.save(function(err, category) {
					console.log('category.id >>>> ' + category.id);
					movie.category = category.id;
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie.id);
					});
				});
			}
		});
	}
};

exports.update = function(req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				if (err) {
					console.log(err);
				}
				res.render('admin', {
					title: 'imooc 后台更新頁',
					movie: movie,
					categories: categories
				})
			});
		});
	}
};

exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	});
};

exports.del = function(req, res) {
	var id = req.query.id;
	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				})
			}
		});
	}
};