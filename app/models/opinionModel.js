const	mongoose = require("mongoose"), 
		express = require('express');

const	app = express();

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

var OpinionSchema = new Schema ({
	username: {
		type: String,
		trim: true,
		unique: false
	},
	q1: {
		type: String,
		trim: true
	},
	a1: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	q2: {
		type: String,
		trim: true
	},
	a2: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	q3: {
		type: String,
		trim: true
	},
	a3: {
		type: String,
		trim: true,
		required: "Please answer all questions."
	},
	postID: {
		type: Schema.Types.ObjectId,
		ref: "Post"
	},
	created: {
		type: Date,
		default: Date.now
	}

});
// console.log("Opinion Schema:", OpinionSchema)
OpinionSchema.methods.saveOpinion = function(req, res, Post, opinion) {
	this.save(function(err, data) {
			if(err) {
				console.log("save opinion error:",err);
			} else {
				// console.log('req.query.postID ' + req.query.postID)
				return Post.update({_id: req.query.postID}, {$push: {"Opinion": opinion._id}}, {new: true}).exec(function(err, numAffected) {
					if(err) {
						console.log(err);
					} else {
						console.log('6 opinion id ' + opinion._id)
						console.log("numAffected ", numAffected);
						res.redirect('/showopinion' + '=true&postID=' + req.query.postID);
					}
				});
			}
		});
};


var Opinion = mongoose.model("Opinion", OpinionSchema);

module.exports = Opinion;