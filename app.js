var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

seedDB(); //seed the database with starter data

app.get("/", function(req,res){
    res.render("landing");
});

//INDEX : Show all camgrounds from DB
app.get("/campgrounds",function(req,res){
    //GET ALL CG from DB
    Campground.find({},function (err,allCampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render("index",{campgrounds:allCampgrounds});
        }
    });
    
});

//CREATE ROUTE : add a new campground to DB
app.post("/campgrounds",function (req,res) {
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name : name, image : image, description : desc};
   //create a new CG and save to DB
   Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
             //redirect back to campgrounds page 
             res.redirect("/campgrounds");
        }
   });
  
});

//NEW :  Displays form to add a new CG to DB
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

//SHOW : Displays more data about particular CG from DB (should be after every NEW route)
app.get("/campgrounds/:id",function(req,res){
    //Find CG with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            //render show template with that campground
                res.render("show",{campground:foundCampground});
        }
    });
});

app.listen(5000, function () {
    console.log("Server has started");
});