var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
config = require('./config/config.js');
const routes = require('./app');

const push_shielder =require('./app/Controller/push_Shielder')
const shielderweb =require('./app/Controller/shielder_web');
const pull_shielder = require('./app/Controller/pull_shielder.js');
const control = require('./app/Controller/controlServer.js');

app.set('host',config.host);
app.set('port',process.env.PORT || 3000);
process.on('warning', e => console.warn(e.stack));

var options = {
  inflate: true,
  limit: '2mb',
  type: 'application/octet-stream'
};


app.use(bodyParser.raw(options));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',routes.router)
/**
 * @param ip
 * @param port
 * @param session 
 * @param serial
 */
var device_list = []
var server = app.listen(app.get('port'), async function () {

   console.log("Example app listening at ", app.get('host'), app.get('port'));
   


   /** Pegar e guardar no Express o MacAddress da maquina host*/
   try{
      macAddress = await shielderweb.get_mac_address()
      app.set('mac',macAddress);
   }catch(error){
      console.log("Erro"+error)
   }
   /**Pegar IP do Host */
   try{
      ip = await shielderweb.get_local_ip()
      app.set('ip',ip);
   }catch(error){
      console.log("Erro"+error)
   }

     
   /**enviar o servidor para registrar */
   try{
      response = await push_shielder.autorizaBox(app.get('ip'),app.get('mac'))   
      console.log(response)   
   }catch(error){
         console.log("Erro"+ error)
   }
   
   try{
      device_list = await control.put_session()
      //console.log(device_list)
   }catch(error){
      console.log("Erro ao Pegar sessao"+error);
   }
   

   if(device_list){
      for (var i=0; i<device_list.length;i++){
         try{
            device_list[i].serial = await control.get_serial(device_list[i])
            device_list[i].id = await push_shielder.autorizaBox(device_list[i].ip,device_list[i].serial)
            device_list[i].devid = await control.get_devid(device_list[i])
            res = await control.set_monitor(app.get('ip'),device_list[i])
            //console.log(res)
         }catch(error){
            console.log("Erro ao configurar o dispositivo"+error);
         }
         
      }
   }
   
   //console.log(device_list)   
   app.set('device_list',device_list);


   setInterval(function(){pull_shielder.copiaMoradores(app.get('mac'),app.get('device_list')).then(response =>{
      console.log(response)
   }).catch(error=>{
      console.log("Erro ao obter moradores para copiar"+error);
   })},5000)

   setInterval(function(){pull_shielder.apagaMoradores(app.get('mac'),app.get('device_list')).then(response =>{
      console.log(response)
   }).catch(error=>{
      console.log("Erro ao obter moradores para apagar"+error);
   })},5000)


   app.set('mutex_Ler',true)
   setInterval(async function(){
      //console.log(app.get('mutex_Ler'))
      try{
      if(app.get('mutex_Ler'))
         var response = await pull_shielder.lerDigital(app.get('mac'))
            var res = await control.remote_digital(app.get('device_list'),response)
            console.log(res);
         
            
      }catch(error){
         console.log("Erro ao tentar ler digital"+error);
      }
      },5000)
   
})