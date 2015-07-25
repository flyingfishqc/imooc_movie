var mongoose = require('mongoose')
var MovieShcema = mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	summary: String,
	poster: String,
	flash: String,
	country: String,
	year: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

MovieShcema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}

	next()
})

MovieShcema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({ _id: id })
		.exec(cb)
	}
}

module.exports = MovieShcema
