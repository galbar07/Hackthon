const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = {

    Date_String:function(){
        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth(); 
        var year = currentDate.getFullYear();
        return date + "/" + (month+1)  + "/" + year;
    },
    Check_heat:function(Heat,First_Name,Last_Name,phone){
        if(Heat>=38){
            client.messages
             .create({
             body: 'Hi'+First_Name +" "+ Last_Name +',Please go home',
             from: '+19382229581',
             to:'+972'+phone
          })
         .then(message => console.log(message.sid));
           }
           else{
             client.messages
         .create({
            body: 'Hi'+First_Name +" "+ Last_Name +', please fill the following form : http://localhost:3000/Form',
            from: '+19382229581',
            to:'+972'+phone
         
          })
         .then(message => console.log(message.sid));
           }
    }
}