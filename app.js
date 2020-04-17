const express = require("express");
const ejs= require("ejs");
var pg = require('pg');
const bodyParser = require("body-parser");
var tools = require('./tools');
var argv = require('minimist')(process.argv.slice(2));//Extract Id from Command Line
require('dotenv').config();



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));



var Id = argv["_"][0];
var Heat = parseFloat(argv["_"][1]);
var monthDateYear  =  tools.Date_String();//Get a Date as a String
let phone;
var First_Name;
var Last_Name;
var Company;

function Conect_SQL(){
  var client = new pg.Client(process.env.POSTGRESS);
    client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM employees where id='+Id, function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }
          init(result.rows[0]);
          Update_Heat();
          
         
        });
      });

};


function Update_Heat(){
  var client = new pg.Client(process.env.POSTGRESS);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('UPDATE employees set heat='+Heat +"where id="+Id, function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
    });
  });
}

function init(User){
  console.log(User);
  First_Name=User.firstname;
  Last_Name=User.lastname;
  phone=User.phone;
  Company=User.company;
  //tools.Check_heat(Heat,First_Name,Last_Name,phone);//send sms depending on his Heat temp
}

app.get("/",function(req,res){
  res.send("Hello");
});

app.get("/form",function(req,res){
  res.render("Form",{First_Name,Id,Company,monthDateYear,Last_Name});
});

app.get("/success",function(req,res){
  res.render("success");
});

app.post("/fill",function(req,res){
    res.redirect("success")
});
  

app.listen(3000 , function() {
  console.log("Server started on port 3000");
  Conect_SQL();
  
});


