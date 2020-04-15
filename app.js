const express = require("express");
const ejs= require("ejs");
var pg = require('pg');
require('dotenv').config();
const bodyParser = require("body-parser");
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


var argv = require('minimist')(process.argv.slice(2));//Extract Id from Command Line
var currentDate = new Date();


var date = currentDate.getDate();
var month = currentDate.getMonth(); 
var year = currentDate.getFullYear();
var monthDateYear  =  date + "/" + (month+1)  + "/" + year;


var Id = argv["_"][0];
var Heat = parseFloat(argv["_"][1]);
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
  Check_heat();
}


function Check_heat(){


// if(Heat>=38){

//    client.messages
//     .create({
//     body: 'Hi'+First_Name +" "+ Last_Name +',Please go home',
//     from: '+19382229581',
//     to:'+972'+phone
//  })
// .then(message => console.log(message.sid));

//   }
//   else{
//     client.messages
// .create({
//    body: 'Hi'+First_Name +" "+ Last_Name +', please fill the following form : http://localhost:3000/Form',
//    from: '+19382229581',
//    to:'+972'+phone

//  })
// .then(message => console.log(message.sid));
//   }


}

app.get("/",function(req,res){
  res.send("Hello");
  
});

app.get("/form",function(req,res){
  res.render("Form",{First_Name,Id,Company,monthDateYear});
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
 Conect_SQL();
  

});


