const Category = require('../models/category');
const _ = require('underscore');

exports.new = function(req, res) {
	res.render('categoryAdmin', {
		title: 'imooc 后台分類錄入頁',
		category: {}
	})
};

exports.save = function(req, res) {
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err, movie) {
		if (err) {
			console.log(err);
		}
		res.redirect('/admin/category/list');
	});
};

exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('categorylist', {
			title: 'imooc 分類列表页',
			categories: categories
		})
	});
};