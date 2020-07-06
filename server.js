var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
config = require('./config/config.js');
const routes = require('./app');
var evilscan = require('evilscan')
const device =require('./app/Controller/contact_device')
const push_shielder =require('./app/Controller/push_Shielder')
const shielderweb =require('./app/Controller/shielder_web');
const pull_shielder = require('./app/Controller/pull_shielder.js');


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


   console.log("Example app listening at ", app.get('host'), app.get('port'));

   shielderweb.get_mac_address().then(response=>{
      //console.log(response)
      app.set('mac',response);
      push_shielder.autorizaBox(app.get('host',app.get('mac'))).then(response=>{
         console.log(response)
      })
   })

   
   try{
      await put_session()
      //console.log(device_list)
   }catch(error){
      console.log(error);
   }
   

   if(device_list){
      for (var i=0; i<device_list.length;i++){
         try{
            device_list.serial = await get_serial(device_list[i])
            push_shielder.autorizaBox(device_list.ip,device_list.serial).then(response=>{
               console.log(response)
            })
         }catch(error){
            console.log("Erro ao pegar serial"+error);
         }
         
      }
   }
   console.log(device_list)
   app.set('device_list',device_list);
   
})



let get_serial = (item) =>{
   return new Promise((resolve, reject)=>{
      var url = 'http://'+item.ip+':'+item.port+'/system_information.fcgi?session='+ item.session;
      device(url,'system_data','get_system_information')
      .then(response=>{
         //console.log(response)
         resolve (response.serial)
      })
      .catch(response=>{
         //console.log(response)
         reject (response)
      })
   })
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



var options_scan = {
   target: '192.168.15.0/24',
   port:'8000',
   status: 'O',
   banner:true,
   concurrency: '2000',
   json:true
}
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
