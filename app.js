const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan')('dev');
const dbUrl = 'mongodb://localhost/imooc';

mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);
			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath);
				}
			} else if (stat.isDirectory) {
				walk(newPath);
			}
		});
}
walk(models_path);

app.set('views', './app/views/pages')
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
	secret: 'imooc',
	resave: false,
	saveUninitialized: false
}));
app.use(require('connect-multiparty')());

require('./config/routes')(app);


if (app.get('env') === 'development') {
	app.use(logger);
}


app.listen(port);
app.locals.moment = require('moment');
app.use(serveStatic(path.join(__dirname, 'public')));

console.log('imooc started on port ' + port);