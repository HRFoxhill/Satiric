const express = require("express"),
	bodyParser = require("body-parser"),
	logger = require("morgan"),
	mongoose = require("mongoose"),
	request = require("request"),
	cheerio = require("cheerio"),
	PORT = process.env.PORT || 3000;
exphbs = require('express-handlebars'),
	util = require('util'),
	jquery = require('jquery');

let Post = require('./app/models/postModel'),
	Opinion = require('./app/models/opinionModel.js');
// Mongoose mpromise deprecated - use bluebird promises
let Promise = require("bluebird");

mongoose.Promise = Promise;

let app = express();

app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// Database configuration with mongoose
mongoose.connect("mongodb://HRFoxhill:Never4get@ds153719.mlab.com:53719/heroku_fpg8rrcq");
//command for git bash
// mongoose.connect("mongo ds153719.mlab.com:53719/heroku_fpg8rrcq -u HRFoxhill -p Never4get");

let db = mongoose.connection;

db.on("error", function (error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
	console.log("Mongoose connected woohoo!.");
});

//MONGODB_URI as => mongolab-polished-17211
//MONGODB_URI is mongodb://heroku_z3vrnqqn:u5ah129tbdnucvkud7ksra1ika@ds119718.mlab.com:19718/heroku_z3vrnqqn -- paste as argument into mongoose.connect() function


app.use(logger('merged'));
logger('merged', { buffer: true });

request("https://www.theonion.com/", function (error, response, html) {
// console.log(html);
	// Load the HTML into cheerio
	let $ = cheerio.load(html);
	//   let $ = cheerio.load(response.data);
	// Make an empty array for saving our scraped info
	// let result = [];

	// With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
	$(".post-wrapper").each(function (i, element) {

		let postHeadline = $(element).find("article").children("header").children("h1").find("a").text();
		// console.log(postHeadline);
		let postTimestamp = $(element).find("article").children("header").children(".meta--pe").children(".meta__container").children("time").find("a").text();
	
		let postUrl = $(element).find("article").children("header").children("h1").find("a").attr("href");
		// console.log(postUrl);
		let postText = $(element).find("article").children("item__content").children(".excerpt").find("p").text();
		console.log("postText:", postText);
		 

		// result.title = $(this).children('header').children('h2').text().trim() + "";

        // result.link = 'http://www.theonion.com' + $(this).children('header').children('h2').children('a').attr('href').trim();

        // result.summary = $(this).children('div').text().trim() + ""; 





		let newPost = new Post({
			headline: postHeadline,
			date: postTimestamp,
			link: "https://www.theonion.com/" + postUrl,
			post: postText
		});

		newPost.save(function (err, data) {
			if (err) {
				console.log(`newPost error:   ${err}`);
			} else {
				console.log("post data" , data);
			}
		});
	}); //cheerio each
});//request

app.get('/', function (req, res) {

	let post = new Post(req.query);

	//mongoose call for all articles

	post.goGetAll(res);

});

app.get('/indepth', function (req, res) {
	//get from the mongo post document selected and display it on the page with handlebars.

	let post = new Post(req.query);

	post.goGetOne(req, res);


});

app.get('/submit', function (req, res) {
	console.log("hit submit opinion button", opinion);
	let opinion = new Opinion(req.query);
	console.log('opinion instance ' + opinion);
	Opinion.saveOpinion(req, res, Post, opinion);

});

app.get('/showopinion', function (req, res) {
	let post = new Post(req.query);
	console.log('post instance ' + post);
	post.viewOpinions(req, res, Opinion, post);
});

app.get("/opinions/:id", function (req, res) {
	db.opinions.goGetOne({_id: req.params.id })
	.populate("opinions")
	.then(function (dbopinions) {
		res.json(dbopinions);
	})
	.catch(function (err) {
		res.json(err);
	});
});

app.listen(PORT, function () {
	console.log('app listening on port ' + PORT);
});

/* 
to do:
1.  scrape dailykos headlines and dates and save articles to mongo. -- friday
2.  prevent saving of duplicate headlines.  -- friday
3.  write handlebars to display articles --monday
4.  write front end to display full post and enter a opinion. -- monday
5.  push more than one opinion to notes collection with questions with the object id of the title. -- tuesday
6.  retrieve notes for an post in another handlebars view on click with jquery. -- wednesday
7.  css and front end -- thursday-saturday
Pseudocode:
concept for the site:  what do you think?  comment on how the news is reported.   
on load scrape dailykos.com for headlines, links to dailykos comments, full text, byline, date, and main images,  storing that to mongo db in the articles collection.  The server starts by scraping just the headlines and dates to the post documents to get a fully functional app before adding details.  If the title and date match an entry already in the articles collection, the post isn't saved.
basic functionality is to save a opinion that is a single line of text into the notes collection and populate notes to the post by saving the object id of the post into the notes that are associated with it.
extended functionality is to ask a single set of 3 questions to each user about the news post that they are reading, plus their name and a timestamp.
more extended functionality is to create a login for each user in a users collection and have the user object id associated with each opinion and the opinion id concatenated with a comment number associated with each user in an array.    make timestamps of comments match the format of timestamps of articles.  I definitely won't get to this.
On the main page, handlebars, mongoose and a forEach iterate over the headlines stored in the articles collection in reverse chronological order.
on click, handlebars and mongoose find one uses a different view to display the single post text and hard code the opinion entry field.
popup handled by remodal.  if login popup use remodal also.
three questions: brainstorm when the basic functionality is complete.
design inspiration: modern old newspaper showing monochrome headlines in Times with a ye olde title font in four columns with rollover in color that changes the font of the post to sans-serif and the header of the site to color and a modern font.  Click on a headline and it flies to the upper left still in 1/4.  Comments section is in a 1/4 column under the headline, with a view all opinions button under the submit button that toggles the opinions popup.  post displays in the right 3/4 column.  submit your opinion and a pop-up displays all opinions.  
 */