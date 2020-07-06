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
var server = app.listen(app.get('port'), async function () {
   //var host = server.address().address
   //var port = server.address().port

   console.log("Example app listening at ", app.get('host'), app.get('port'));
   //timer
   try{
      await put_session()
      console.log(device_list)
   }catch(error){
      console.log(error);
   }
   



   // if(device_list!=null){
   //    for (var i=0; i<device_list.length;i++){
   //       try{
   //          device_list.serial = await get_serial()
   //       }catch(error){
   //          console.log("Erro ao pegar serial"+error);
   //       }
         
   //    }
   // }
   //console.log(device_list)
   app.set('device_list',device_list);
   
   
})



async function get_serial(item) {
      var url = 'http://'+item.ip+':'+item.port+'/system_information.fcgi?session='+ item.session;
      device(url,'system_data','get_system_information')
      .then(response=>{
         return response.serial
      })
      .catch(response=>{
         console.log(response)
         throw TypeError(response)
      })
   
}








var options_scan = {
   target: '192.168.0.0/24',
   port:'8000',
   status: 'O',
   banner:true,
   concurrency: '2000',
   json:true
}

async function put_session(){
   var devices
   try{
    devices = await get_ips
    
   }catch(e){
      console.log("Não foi possível adquirir os IP'S " + e);
   }

   for (var i=0; i<devices.length;i++){
      
      try{
         session = await get_session(devices[i])
         var d = {
            ip : devices[i].ip,
            port : devices[i].port,
            session : ""
         }
         //console.log(session)
         d.session = session;
         if(d.session)
            device_list.push(d)
      }catch(e){
         throw TypeError("Não foi possível adquirir a sessão " + e);
      }
   }
}



/** utiliza a instancia da classe contact_device, para obter , através do Axios, a resposta que será a sessao,
 * com ela retorna a sessao
 */
let get_session = (item) =>{
   return new Promise((resolve, reject)=>{
      var url = 'http://'+item.ip+':'+item.port+'/login.fcgi';
      device(url,'system_data','login')
      .then(response=>{
         item.session = response.session
         resolve (response.session)
      })
      .catch(response=>{
         reject(response)
      })
   })
   
};




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
