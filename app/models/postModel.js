const	mongoose = require("mongoose"), 
			express = require('express');

const	app = express();

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

var PostSchema = new Schema ({
	headline: {
		type: String,
		trim: true,
		unique: true,
		required: "Headline is required"
	},
	date: {
		type: String,
		trim: true
	},
	link: {
		type: String,
		trim: true,
		unique: true
	},
	story: {
		type: String,
		trim: true
	}, 
// 	opinion: [{
//     type: Schema.Types.ObjectId
//   }]
});

PostSchema.methods.goGetAll = function(res) {
	return this.model('Post').find({}).sort({date: -1}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			console.log("1", data);
			res.render('../views/index.hbs', { post: data});
		}
	});
};

PostSchema.methods.goGetOne = function(req, res) {
	return this.model('Post')
		.find({_id: req.query.postID})
		.exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			console.log("2", data);
			res.render('../views/post.hbs', {post: data[0], showOpinion: false});
		}
	});
};

// app.get("/articles/:id", function (req, res) {
//     db.Article.findOne({ _id: req.params.id })
//         .populate("note")
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// })


PostSchema.methods.viewOpinions = function(req, res, Opinion, post) {
	return this.model('Post')
	.find({_id: req.query.postID})
	.exec(function(err, data) {
		console.log('viewOpinions');
		console.log("3", data);
			Opinion.find({_id: {$in: data[0].opinion}})
			.sort({created: -1})
			.exec(function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					console.log('doc is ' + doc);
					res.render('../views/post.hbs', {post: data[0], opinions: doc, showOpinion: req.query.showOpinion});
				}
			});
	});
};



var Post = mongoose.model("Post", PostSchema);

module.exports = Post;