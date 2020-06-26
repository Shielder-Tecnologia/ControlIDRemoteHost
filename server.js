var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
var dateFormat = require('dateformat');
config = require('./config/config.js');
var fetch = require('node-fetch');
const routes = require('./app');
var evilscan = require('evilscan')
const device =require('./app/Controller/contact_device')

app.set('host',config.host);
app.set('port',process.env.PORT || 3000);

var options = {
  inflate: true,
  limit: '2mb',
  type: 'application/octet-stream'
};


app.use(bodyParser.raw(options));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',routes.router)


var server = app.listen(app.get('port'), function () {
   //var host = server.address().address
   //var port = server.address().port

   console.log("Example app listening at ", app.get('host'), app.get('port'));
   //timer
   get_ips.then(devices=>{
      get_session(devices)
   }).catch(message=>{
      console.log(message)
   })
   
})

var options_scan = {
   target: '192.168.1.0/24',
   port:'8000',
   status: 'O',
   banner:true,
   concurrency: '2000',
   json:true
}

/** PEGAR A SESSAO E GUARDALA COM O VETOR DE INFORMACOES DO DISPOSITIVO */
get_session = (array)=>{
   array.forEach(element => {
      var url = 'http://'+element.ip+':'+element.port+'/login.fcgi';
      device(url,'system_data','login').then(response=>{
         element.session = response.session
         console.log(element.session)
      }).catch(response=>{
         console.log(response)
      })
   });
}

let get_ips = new Promise((resolve,reject)=>{
   var scanner = new evilscan(options_scan);
   var data_device = []
   scanner.on('result',function(data) {
      // fired when item is matching options
      data_device.push(data)
   });

   scanner.on('error',function(err) {
      reject(data.toString());
   });

   scanner.on('done',function() {
      resolve (data_device)
   });

   scanner.run();
})
