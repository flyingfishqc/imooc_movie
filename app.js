var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost:12345/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')

app.listen(port)

console.log('imooc started on ' + port)

// index page
app.get('/', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err)
		}

		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		})
	})
})

// detail page
app.get('/movie/:id', function (req, res) {
	var id = req.params.id
	Movie.findById(id, function (err, movie) {
		res.render('detail', {
			title: 'imooc ' + movie.title,
			movie: movie
		})
	})
	/*res.render('detail', {
		title: 'imooc 详情页',
		movie: {
			doctor: '何塞.帕迪里亚',
			country: '美国',
			title: '机械战警',
			year: 2014,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			language: '英语',
			flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary: '翻拍自1987年同名科幻经典、'
		}
	})*/
})


// admin page
app.get('/admin/movie', function (req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
})

// admin update movie
app.get('/admin/update/:id', function (req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function (err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页面',
				movie: movie
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id != 'undefined') {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			falsh: movieObj.falsh,
		})

		_movie.save(function (err, movie) {
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}

})

// list page
app.get('/admin/list', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	})
})

// list delete movie
app.delete('/admin/list', function (req, res) {
	var id = req.query.id
	console.log('deleting...' + id)

	if (id) {
		Movie.remove({ _id: id }, function (err, movie) {
			if (err) {
				console.log(err)
			}
			else {
				res.json({ success: 1 })
			}
		})
	}
})