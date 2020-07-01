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

var device_list = []
var server = app.listen(app.get('port'), function () {
   //var host = server.address().address
   //var port = server.address().port

   console.log("Example app listening at ", app.get('host'), app.get('port'));
   //timer
   get_ips.then(devices=>{
      //var device_data = get_session(devices)
      console.log(devices.length)
      for (var i=0; i<devices.length;i++){
         var d = {
            ip : devices.ip,
            port : devices.port,
            session : get_session(devices[i])
         }
         console.log("meu piru")
         device_list.push(d) 
      }
      //console.log(device_list)
      //console.log(devices)
   }).catch(message=>{
      console.log(message)
   })
   
})

var options_scan = {
   target: '192.168.15.0/24',
   port:'8000',
   status: 'O',
   banner:true,
   concurrency: '2000',
   json:true
}
//TODO, ou fazer um async await, e throw error no catch, ou fazer uma promise e enviar um reject no catch e dai pegar esse erro 


/** PEGAR A SESSAO E GUARDALA COM O VETOR DE INFORMACOES DO DISPOSITIVO */
// get_session = (array)=>{
   let get_session = (item) =>{
      return new Promise((reseolve, reject){
         var url = 'http://'+item.ip+':'+item.port+'/login.fcgi';

         device(url,'system_data','login')
         .then(response=>{
            item.session = response.session
           //console.log(response.session)
            resolve (response.session)
         })
         .catch(response=>{
            console.log(response)
            reject(response)
         })
      })
      
   };
   //return array
// }





let get_ips = new Promise((resolve,reject)=>{
   var scanner = new evilscan(options_scan);
   var data_device = []
   scanner.on('result',function(data) {
      // fired when item is matching options
      //console.log(data)
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
