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
var submask;
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



   try{
      device_list = await control.put_session(submask)
      app.set('device_list',device_list);
   }catch(error){
      console.log("Erro ao Pegar sessao"+error);
   }
   /**Setup primeira vez que conecta */
   if(device_list!=[]){
      for (var i=0; i<device_list.length;i++){
         try{
            device_list[i].serial = await control.get_serial(device_list[i])
            device_list[i].id = await push_shielder.autorizaBox(device_list[i].ip,device_list[i].serial)
            
            device_list[i].devid = await control.get_devid(device_list[i])
            console.log("Setando monitor: "+app.get('ip'),device_list[i])
            res = await control.set_monitor(app.get('ip'),device_list[i])
            console.log(res)
            res = await control.set_date(device_list[i])
            // console.log("res")
            // console.log(res)
            app.set('device_list',device_list);
            //console.log(res)
         }catch(error){
            console.log("Erro ao configurar o dispositivo"+error);
         }
         
      }
   }else
      console.log('Não há dispositivos')
      console.log("device_list")
      console.log(device_list)

   /**TIMER PARA VERIFICAR IPS E DAR AUTORIZABOX */
   setInterval(async function(){
      //console.log(app.get('mutex_Ler'))
      var device_list_in  = [];
      var device_list_new = [];
      
      try{
         device_list_new = await control.put_session(submask)
         /**loop para verificar se tem algum novo ou */
         for(var i=0; i<device_list_new.length;i++){
            var d = device_list.findIndex(x => x.ip == device_list_new[i].ip);
            console.log("device_list_new")
               console.log(device_list_new)
            if(d==-1){
               device_list_in.push(device_list_new[i]);
               console.log("device_list_in")
               console.log(device_list_in)
            }
            device_list[d].session = device_list_new[i].session;
         }
         /**loop para verificar se algum foi desconectado */
         for(var i=0; i<device_list.length;i++){
            var d = device_list_new.find(x => x.ip == device_list[i].ip);
            if(d==undefined){
               device_list.splice(i,1)
            }
            if(device_list[i].hasOwnProperty('id') && device_list[i].id<=2){
               device_list[i].id = await push_shielder.autorizaBox(device_list[i].ip,device_list[i].serial)
            }
         }

         app.set('device_list',device_list);
         //console.log(device_list)
      }catch(error){
         console.log("Erro ao Pegar sessao "+error);
      }

      /**pegar todos dados necessarios dos novos dispositivos conectados */
      if(device_list_in){
         for (var i=0; i<device_list_in.length;i++){
            try{
               console.log("Pegando serial: "+app.get('ip'),device_list_in[i])
               device_list_in[i].serial = await control.get_serial(device_list_in[i])
               console.log("autorizabox: "+app.get('ip'),device_list_in[i])
               device_list_in[i].id = await push_shielder.autorizaBox(device_list_in[i].ip,device_list_in[i].serial)
               console.log("pegando devid: "+app.get('ip'),device_list_in[i])
               device_list_in[i].devid = await control.get_devid(device_list_in[i])
               console.log("Setando monitor: "+app.get('ip'),device_list_in[i])
               res = await control.set_monitor(app.get('ip'),device_list_in[i])
               console.log(res);
               res = await control.set_date(device_list_in[i])
               device_list.push(device_list_in[i])
               app.set('device_list',device_list);
            }catch(error){
               console.log("Erro ao configurar o dispositivo"+error);
            }
         }  
      }
      console.log(moment().format('MMMM Do YYYY, h:mm:ss a')+" Device List: ");
      console.log(device_list)
      },15000)

  
   
   
   

      if(device_list!=null){
         setInterval(function(){pull_shielder.copiaMoradores(app.get('mac'),app.get('device_list')).then(response =>{
             console.log("Copia:")
             console.log(response)
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
               console.log("ss"+response)
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