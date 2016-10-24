var express = require("express");
var mongo = require('mongodb');
var monk = require('monk');
var hbs = require("hbs");

var app = express();
var db = monk('localhost:27017/test');

app.use(express.static('public'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Make our db accessible to our router
// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });
var items = db.get('items');


//Just simply copied from the next router making the page = 1 to get the req '/', there may be a easier way to do it. 
app.get('/', function(req, res){
	// var db = req.db; 
	var page = 1;

	//Better than sort seperately
	items.count({}, function(err, count){
		items.find({}, {'sort': {'date': -1}, 'limit': 10, 'skip': (page-1)*10}, function(err, docs){
			// var pagenumber = Object.keys(docs).length;
			var pagenumber = Math.ceil(count/10);
			var pages = [];
			for(var i = 1; i <= pagenumber; i++){
				pages.push({
					'page': i,
					'pagenumber': pagenumber
				});
			}	
			var curPage = pages[page-1];
			console.log('Request for ' + req.path + ' received.');
			res.render('index', {entries: docs, pages: pages, curPage: curPage});
		});		
	});
});

app.get('/:p', function(req, res){
	// var db = req.db; 
	var page = parseInt(req.params.p) || 1;

	//Better than sort seperately
	items.count({}, function(err, count){
		items.find({}, {'sort': {'date': -1}, 'limit': 10, 'skip': (page-1)*10}, function(err, docs){
			// var pagenumber = Object.keys(docs).length;
			var pagenumber = Math.ceil(count/10);
			var pages = [];
			for(var i = 1; i <= pagenumber; i++){
				pages.push({
					'page': i,
					'pagenumber': pagenumber
				});
			}	
			var curPage = pages[page-1];
			console.log('Request for ' + req.path + ' received.');
			res.render('index', {entries: docs, pages: pages, curPage: curPage});
		});		
	});
});

app.get('/article/:id', function(req, res){
	var id = req.params.id;
	items.find({'_id': id}, function(err, docs){
		console.log('Request for ' + req.path + ' received.');
		res.render('article', {entry: docs[0]});
	});
});

var server = app.listen(8081, function(){
	console.log('Server is running.');
})