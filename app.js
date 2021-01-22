require('dotenv').config()
const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app=express();
const saltRounds=10;
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret=process.env.SECRET;
const User = new mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
    const newUser=new User({
      email: req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }
    });
    });
  });

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,foundResult){
    if(err){
      console.log(err);
    }else{
      if(foundResult){
        bcrypt.compare(password, foundResult.password).then(function(result) {
          if(result===true){
            res.render("secrets");
          }
        });

      }
      else{
        res.redirect("/");

      }
    }

  });
});




app.listen(3000,function(){
  console.log("Sever is running on port 3000");
});
