const User = require('../models/user');

exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '註冊頁面'
	});
};

exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登錄頁面'
	});
};

exports.signup = function(req, res) {
	var _user = req.body.user;

	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			return res.redirect('/signin');
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			});
		}
	});
};

exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			return res.redirect('/signup');
		} else {
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					console.log(err);
				}
				if (isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					return res.redirect('/signin');
				}
			});
		}
	});
};

exports.logout = function(req, res) {
	delete req.session.user
	res.redirect('/');
};

exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: 'imooc 用戶列表页',
			users: users
		})
	});
};

//midware for user
exports.signRequired = function(req, res, next) {
	var user = req.session.user;

	if (!user) {
		return res.redirect('/signin');
	}

	next();
};

//midware for user
exports.adminRequired = function(req, res, next) {
	var user = req.session.user;

	if (user.role <= 10) {
		return res.redirect('/signin');
	}

	next();
};