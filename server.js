var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
config = require('./config/config.js');
const routes = require('./app');
var moment = require('moment')

const push_shielder =require('./app/Controller/push_Shielder')
const shielderweb =require('./app/Controller/shielder_web');
const pull_shielder = require('./app/Controller/pull_shielder.js');
const control = require('./app/Controller/controlServer.js');
const controlServer = require('./app/Controller/controlServer.js');

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
 * @param devid
 */
var device_list = []
/**@param devid 
 * @param request
 * @param tipo
 * @param uuid
 */
var push_list = []
var submask;


var server = app.listen(app.get('port'), async function () {

   console.log("Example app listening at ", app.get('host'), app.get('port'));
   
   app.set('push_list', push_list)
   app.set('device_list', device_list)

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
      submask = ip.split(".")[2];
      //console.log(submask)
      app.set('ip',ip);
   }catch(error){
      console.log("Erro"+error)
   }

     
   /**AUTORIZABOX PARA O SERVIDOR */
   try{
      response = await push_shielder.autorizaBox(app.get('ip'),app.get('mac'))   
      console.log(response)   
   }catch(error){
         console.log("Erro"+ error)
   }
   
   
   

      if(device_list!=[]){
         setInterval(function(){pull_shielder.copiaMoradores(app.get('mac'),app.get('device_list')).then(response =>{
             console.log("Copia:")
             
             if(response!=null){
               console.log(response)
               controlServer.controlCopia(response,app.get('device_list'),app.get('push_list')).then(res=>{
                  push_list = res;
                  app.set('push_list',push_list)
               }).catch(error=>{
                  console.log("Erro"+error)
               })
             }
             
         }).catch(error=>{
            console.log("Erro ao obter moradores para copiar"+error);
         })},5000)

         setInterval(async function(){
            try{
               var response = await pull_shielder.apagaMoradores(app.get('mac'),app.get('device_list'))
               console.log("Apaga: ")
               console.log(response)
            if(response!=null)
               var res = await control.controlApaga(app.get('device_list'),response)
               
               
            }catch(error){
               console.log("Erro ao obter moradores para apagar"+error);
            }
            
         },5000)


         app.set('mutex_Ler',true)
         setInterval(async function(){
            //console.log(app.get('mutex_Ler'))
            try{
               
               
               var response = await pull_shielder.lerDigital(app.get('mac'))
               console.log("Ler digital")
               console.log(response)
               if(app.get('mutex_Ler')){
                  if(response){
                     var res = await control.remote_digital(app.get('device_list'),response)
                     //console.log(res);
                     app.set('mutex_Ler',false)
                  }
               }else if (response){

               }
            }catch(error){
               console.log("Erro ao tentar ler digital"+error);
            }
         },5000)
      }else
         console.log('Não há dispositivos')
   
})