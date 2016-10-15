const Movie = require('../models/movie');
const Category = require('../models/category');

exports.index = function(req, res) {
	Category
		.find({})
		.populate({
			path: 'movies',
			options: {
				limit: 6
			}
		})
		.exec(function(err, categories) {
			if (err) {
				console.log(err);
			}
			res.render('index', {
				title: 'imooc 首頁',
				categories: categories
			})
		})
};

exports.search = function(req, res) {
	var cateId = req.query.cate;
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0
	var count = 2;
	var index = page * count;

	if (cateId) {
		Category
			.find({
				_id: cateId
			})
			.populate({
				path: 'movies',
				select: 'title poster'
			})
			.exec(function(err, categories) {
				if (err) {
					console.log(err);
				}
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + count)
				res.render('results', {
					title: 'imooc 結果列表頁',
					keyword: category.name,
					currentPage: (page + 1),
					query: 'cate=' + cateId,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	} else {
		Movie.find({
			title: new RegExp(q + '.*', 'i')
		}).exec(function(err, movies) {
			if (err) {
				console.log(err);
			}
			var results = movies.slice(index, index + count)
			res.render('results', {
				title: 'imooc 結果列表頁',
				keyword: q,
				currentPage: (page + 1),
				query: 'q=' + q,
				totalPage: Math.ceil(movies.length / count),
				movies: results
			})
		})
	}

};