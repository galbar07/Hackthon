const express = require("express");
const ejs= require("ejs");
var pg = require('pg');
const bodyParser = require("body-parser");
var fill_form=[];
var conString = "postgres://ydzqisno:rYRJefbRoE4czrr1H2UurqUtrSNkp7R3@balarama.db.elephantsql.com:5432/ydzqisno"; 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var argv = require('minimist')(process.argv.slice(2));//Extract Id from Command Line


Id = argv["_"][0];
Name = argv["_"][1];
Last = argv["_"][2];
FName = Name+" "+Last;


app.get("/",function(req,res){
    res.send("Hello");
    
 });

 app.get("/form",function(req,res){
    res.render("Form",{Id});
 });

 app.get("/sucess",function(req,res){
    res.render("sucess");
 });

 
 app.get("/failure",function(req,res){
    res.render("failure");
 });

 app.post("/fill",function(req,res){
    console.log(req.body);
    if(req.body.confirm=="on" ){
        res.redirect("sucess")
    }
    else{
        res.redirect("failure");
    }
 });

app.listen(3000, function() {
    console.log("Server started on port 3000");
    SQL_Withdrawl();
  });


  function SQL_Withdrawl(){
    
   var str = Conect_SQL();//Return Row
   console.log(fill_form);
   

  }

function Conect_SQL(){
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM persons', function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows);
          client.end();
        });
      });

};
  