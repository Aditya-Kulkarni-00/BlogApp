var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

// Connecting To Blog App DataBase


mongoose.connect("mongodb://localhost:27017/blog",{useNewUrlParser:true});

// Defaulting to ejs

app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Mongoose Schema 

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created :{type: Date , default:Date.now}
});

var Blog =mongoose.model("Blog",blogSchema);



// Restful Routes 

app.get("/",(req ,res)=>{
	res.redirect("/blogs");
})
// Index Route
app.get("/blogs",(req ,res)=>{
	Blog.find({},(err,blogs)=>{
		if (err){
			console.log(err);
		}
		else {
			res.render("index",{blogs:blogs});
		}
	});
	
});

// new Route 

app.get("/blogs/new",(req, res)=>{
	res.render("new");
})

// Create Route

app.post("/blogs",(req, res)=>{
	// Create Blog 
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err ,newBlog)=>{
		if(err){
			res.render("new");
		}else{
			// Redirect Back to Home Page
			res.redirect("/blogs");
		}
	});
});



//Show Route

app.get("/blogs/:id",(req, res)=>{
	Blog.findById(req.params.id,(err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog : foundBlog});
		}
	});
});

// Edit Route

app.get("/blogs/:id/edit",(req, res)=>{
	Blog.findById(req.params.id,(err, foundBlog)=>{
		if(err){
			res.redirect("\blogs");
		}
		else {
			res.render("edit",{blog :foundBlog});
		}
	});
	
});

// Update Route 

app.put("/blogs/:id",(req, res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+ req.params.id);
		}
		
	})
});


// Delete Route
app.delete("/blogs/:id",function(req, res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
})
// Server Listen
app.listen(8080,()=>{
	console.log("Blog App Server has Started");
})