const Index = require('../app/controllers/index');
const Movie = require('../app/controllers/movie');
const User = require('../app/controllers/user');
const Comment = require('../app/controllers/comment');
const Category = require('../app/controllers/category');

module.exports = function(app) {
	//pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user;
		return next();
	});

	//Index
	app.get('/', Index.index);

	//User	
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);
	app.get('/admin/user/list', User.signRequired, User.adminRequired, User.list);

	//Movie
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie/new', User.signRequired, User.adminRequired, Movie.new);
	app.get('/admin/movie/update/:id', User.signRequired, User.adminRequired, Movie.update);
	app.post('/admin/movie', User.signRequired, User.adminRequired, Movie.savePoster, Movie.save);
	app.get('/admin/movie/list', User.signRequired, User.adminRequired, Movie.list);
	app.delete('/admin/movie/list', User.signRequired, User.adminRequired, Movie.del);

	//Comment
	app.post('/user/comment', User.signRequired, Comment.save);

	//Category
	app.get('/admin/category/new', User.signRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signRequired, User.adminRequired, Category.list);

	//results
	app.get('/results', Index.search);
}