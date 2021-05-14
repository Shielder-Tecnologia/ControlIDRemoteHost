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
app.set('requisitions',0);
app.set('timerReq',0);
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

var submask;

/** Pegar e guardar no Express o MacAddress da maquina host*/
    shielderweb.get_mac_address().then(macAddress=>{
       console.log(macAddress)
      app.set('mac',macAddress);
   }).catch(error=>{
      console.log("Erro"+error)
   })


/**Pegar IP do Host */

   shielderweb.get_local_ip().then(ip=>{
      submask = ip.split(".")[2];
      console.log(ip)
      app.set('ip',ip);
   }).catch(error=>{
      console.log("Erro"+error)
   })
   

var res = 0;
/**AUTORIZABOX PARA O SERVIDOR */
try{
   var refreshIntervalId = setInterval(async function(){
      
      if(res<4){
         res = await push_shielder.autorizaBox(app.get('ip'),app.get('mac'))
      }else{
         clearInterval(refreshIntervalId);
         startServer()
      }
      console.log(res)
   }, 2000);
}catch(error){
      console.log("Erro"+ error)
}





function startServer(){
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


   app.listen(app.get('port'), async function () {

      console.log("Example app listening at ", app.get('host'), app.get('port'));
      
      app.set('push_list', push_list)
      app.set('device_list', device_list)
      console.log("device_list");
      console.log(device_list)
      try{
         setInterval(async function(){
            
            var reqs = app.get('requisitions');
            var timerReq = app.get('timerReq');
            reqs++;
            timerReq++;
            if(timerReq >=2){
               console.log("Número Total de requisições: " + reqs + "   Requisições por minuto: " +reqs/60);
               timerReq = 0;
               reqs = 0;
               const used = process.memoryUsage();
               for (let key in used) {
               console.log(`Memory: ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
               }
               //console.log(process.memoryUsage());
              
            }
            
            app.set('requisitions',reqs);
            app.set('timerReq',timerReq);

            console.log(app.get('device_list').length + " Lista de Dispositivos: "+ moment().format('MMMM Do YYYY, h:mm:ss a'))
            console.log(app.get('device_list'));
            
            var response
            try{
               if(device_list && device_list.length>0){
                  response = await pull_shielder.copiaMoradores(app.get('mac'),app.get('device_list'));
                  console.log("Copia:")
               
                  if(response){
                     //console.log(response)
                     var res = await controlServer.controlCopia(response,app.get('device_list'),app.get('push_list'));
                     push_list = res;
                     app.set('push_list',push_list);
                  }
               }
            }catch(error){
               console.log("Não foi possível copiar o morador " + error + " --resposta url: "+ response)
            }
         },5000)

         setInterval(async function(){
            var response
            try{
               if(device_list && device_list.length>0){
                  var reqs = app.get('requisitions');
                  reqs++;
                  app.set('requisitions',reqs);
                  response = await pull_shielder.apagaMoradores(app.get('mac'),app.get('device_list'))
                  console.log("Apaga: ")
                  
                  if(response){
                     
                     console.log(response)
                     var res = await control.controlApaga(response,app.get('device_list'),app.get('push_list'))
                     push_list = res;
                     app.set('push_list',push_list);
                  }
               }
               
            }catch(error){
               console.log("Erro ao apagar morador "+error +" --resposta url"+ response);
            }
            
         },5000)
         //AUTORIZABOX
         setInterval(async function(){
            var response
            try{
               device_list = app.get('device_list')
               push_list = app.get('push_list')
               //console.log("LOGGGG")
               //console.log(device_list)
               if(device_list && device_list.length>0){
                  
                  for(let m = 0; m<device_list.length; m++){
                     
                     var reqs = app.get('requisitions');
                     reqs++;
                     app.set('requisitions',reqs);
                     //console.log("Log")
                     //console.log(m)
                     push_shielder.autorizaBox(device_list[m].ip,device_list[m].serial,device_list[m].ipremoto).then(response=>{
                        //
                        
                        //device_list[m].id
                        console.log("Autoriza "+device_list[m].id + "   Resposta "+ response)
                        // console.log("moment"+moment().valueOf());
                        // device_list[m].lastOn = moment().valueOf();
                        //console.log(device_list[m].lastOn)
                        if(device_list[m].id == "1" || device_list[m].id == "2")
                           device_list[m].timeout = response
                        // verifica se tem ; para mudar o timeout_relay
                        if(!Number.isInteger(device_list[m].id) && response.indexOf(';')>=0){
                           
                           if(device_list[m].timeout == 3000){
                              var id = response.split(";")
                              device_list[m].timeout = 0;

                              control.get_request_set_relay(0,device_list[m].devid,push_list).then(response=>{                                
                                 push_list = response
                              }).catch(error=>{
                                 console.log(error)
                              })
                           }       
                        }else if(device_list[m].timeout == 0){
                           device_list[m].timeout = 3000;
                           //console.log("Log  3000")
                           console.log(device_list[m].id)
   
                           control.get_request_set_relay(3000,device_list[m].devid,push_list).then(response=>{                                
                                 push_list = response
                           }).catch(error=>{
                                 console.log(error)
                           })
                        }



                        //caso nao tenha sido registrado no shielder ele espera para colocar o id
                        if(!Number.isInteger(device_list[m].id) || device_list[m].id<=4){
                           //console.log("Log registrado")
                           //console.log(device_list[m].id)

                           if(!Number.isInteger(response)){
                                 if(response.indexOf(';')>=0){
                                    var id = response.split(";")
                                    device_list[m].id = id[0];
                                    device_list[m].timeout = 0;
                                    control.get_request_set_relay(0,device_list[m].devid,push_list).then(response=>{                                
                                       push_list = response
                                    }).catch(error=>{
                                       console.log(error)
                                    })
                                 }else{
                                    device_list[m].id = response;
                              }
                           }
                           app.set('device_list',device_list);
                        }

                           
                        app.set('push_list',push_list);
                     }).catch(error=>{
                        console.log(error)
                     })
                  }
               }
               
            }catch(error){
               console.log("Erro no autorizaBox "+error +" --resposta url"+ response);
            }
            
         },60000)

         setInterval(async function(){
            //console.log(app.get('mutex_Ler'))
            var response
            try{
               if(device_list && device_list.length>0){
                  var reqs = app.get('requisitions');
                  reqs++;
                  app.set('requisitions',reqs);
                  response = await pull_shielder.lerDigital(app.get('mac'))
                  console.log("Ler digital")
                  console.log(response)
                  if(response){
                     if(response[0].cadastra_tipo == "1"){
                     var res = await control.remote_digital(response,app.get('device_list'),app.get('push_list'))
                     push_list = res;
                     app.set('push_list',push_list);
                     }else{
                        var res = await control.remote_cartao(response,app.get('device_list'),app.get('push_list'))
                        push_list = res;
                        app.set('push_list',push_list);
                     }
                  }
               }
            }catch(error){
               console.log("Erro ao tentar ler digital"+error);
            }
         },5000)

         setInterval(async function(){
            //console.log(app.get('mutex_Ler'))
            var response
            try{
               if(device_list && device_list.length>0){
                  response = await pull_shielder.lerRelay(app.get('mac'));
                  var reqs = app.get('requisitions');
                  reqs++;
                  app.set('requisitions',reqs);
                  console.log("Ler Relay")
                  console.log(response)
                  if(response){
                     var res = await control.ler_relay(response,app.get('device_list'),app.get('push_list'))
                     push_list = res;
                     app.set('push_list',push_list);
                  }
               }
            }catch(error){
               console.log("Erro ao abrir catraca"+error);
            }
         },3000)

      }catch(error){
         console.log("Erro ao entrar em contato com o Servidor")
      }
      
   })
}