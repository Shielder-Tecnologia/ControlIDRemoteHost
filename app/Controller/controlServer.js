const device =require('./contact_device')
const push_shielder =require('./push_Shielder')
var evilscan = require('evilscan')
const { response } = require('express')
var moment = require('moment')

function onlyUnique(value, index, self) { 
   return self.indexOf(value) === index;
}


var resolve_result = (req) =>{
   return new Promise((resolve, reject)=>{
      var push_list = req.app.get('push_list')
      var device_list = req.app.get('device_list')
      if(device_list)
         var d = device_list.find(x => x.devid == req.query.deviceId);


      if(req.body.code == 1){

      }
      
      
      //se push list n for nulo e tiver um endpoint valido
      if(push_list && push_list.length>0 && req.query.endpoint){         
         var pIndex = push_list.findIndex(x => x.uuid == req.query.uuid);
         //acha o request que foi mandado
        
         if(pIndex!=-1){
            if(req.body.hasOwnProperty('response')){
               var response = JSON.parse(req.body.response)
               //verifica o que que foi mandado para o dispositivo executar, copia/apaga/pegar serial
               switch(push_list[pIndex].tipo){

                  case "get_serial":
                     if(device_list.length == 0 || d == undefined){
                        var device = {}
                        device.devid = req.query.deviceId;
                        device.serial = response.serial;
                        device.ip = response.network.ip;
                        push_shielder.autorizaBox(device.ip,device.serial).then(idShielder=>{
                           device.id = idShielder;
                           device.lastOn = moment().valueOf();
                        }).catch(error=>{
                           reject(error)
                        })
                        console.log("device")
                        console.log(device)
                     }
                     device_list.push(device)
                     req.app.set('device_list',device_list)
                     break;

                  case "set_monitor":
                     console.log("monitor setado")
                     break;
                  
                  case "create_user":
                     console.log("Usuário criado ")
                     break;

                  case "create_group":
                     console.log("grupo inserido");
                     break;
                  case "create_template":
                     
                     push_shielder.cadastraBio(push_list[pIndex].user_id,0,d.serial,'ENTRADA').then(res=>{
                        console.log("Usuario: "+push_list[pIndex].user_id+" criado")
                     }).catch(error=>{
                        reject(error)
                     })
                     break;
                  case "create_card":
                     
                     push_shielder.cadastraBio(push_list[pIndex].user_id,0,d.serial,'ENTRADA').then(res=>{
                        console.log("Usuario: "+push_list[pIndex].user_id+" criado")
                     }).catch(error=>{
                        reject(error)
                     })
                     break; 
                  case "delete_user":
                     push_shielder.cadastraBio(push_list[pIndex].user_id,0,d.serial,'SAIDA').then(res=>{
                        console.log("Usuario: "+push_list[pIndex].user_id+" apagado")
                     }).catch(error=>{
                        reject(error)
                     })

                     break;
                  case "remote_digital":
                     console.log("Template capturada")
                     break;
                  case "get_config":
                     console.log("get config");   
                     break;
                  case "ler_relay":
                     console.log("Catraca " + push_list[pIndex].devid+ " aberta");
                     break;
                  case "set_relay":
                     console.log("Catraca " + push_list[pIndex].devid+ " setada");
                     break;
                  case "set_date":
                     console.log("Data " + push_list[pIndex].devid+ " setada");
                     break;
                  case "set_push":
                     console.log("PUSH " + push_list[pIndex].devid+ " setado");
                     break;
               }
            }
            resolve(pIndex)
         }else{
            reject("Nenhum request foi encontrado")
         }
      }
   })
}

let set_date = (item) =>{
   return new Promise((resolve, reject)=>{
      var url = 'http://'+item.ip+':'+item.port+'/set_system_time.fcgi?session='+ item.session;
      device(url,'system_data','set_date')
      .then(response=>{
         //console.log(response)
         resolve (response)
      })
      .catch(response=>{
         //console.log(response)
         reject (response)
      })
   })
   
};



let remote_digital = (response,device_list,push_list) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
      var dIndex = device_list.findIndex(x => x.id == response[0].id_terminal);
      if(dIndex==-1){
         reject("Dispositivo não encontrado")
         return;
      }
      if(push_list)
         var p = push_list.find(x => x.user_id == response[0].id);
      if(p!=undefined && p.user_id == response[0].id && p.devid ==device_list[dIndex].devid){
         reject("Aguardando dispositivo para capturar a digital do usuário: "+response[0].id)
         return;
      }


      var p = {}
      //REMOTE DIGITAL
      p.devid = device_list[dIndex].devid;
      p.request = { 
         verb: "POST", endpoint: "remote_enroll", body: 
         { 
            "user_id": parseInt(response[0].id),
            "type": "biometry",
            "save": false,
            "sync": false,
            "panic_finger": 0
         } 
      }
      p.user_id= parseInt(response[0].id);
      p.tipo = 'remote_digital'
      push_list.push(p)
      console.log("push remote")
      resolve(push_list)
   })

}

let ler_relay = (response,device_list,push_list) =>{
   return new Promise((resolve, reject)=>{
      for (var i=0; i<response.length;i++){
         //console.log("device_list"+device_list)
         //console.log(response[i].box_idbox)
         var dIndex = device_list.findIndex(x => x.id == response[i].box_idbox);
         if(dIndex==-1){
            reject("Dispositivo não encontrado: " + response[i].box_idbox)
            return;
         }
         if(push_list)
            var p = push_list.find(x => x.tipo == "ler_relay");
         if(p!=undefined &&  p.devid == device_list[dIndex].devid){
            reject("Aguardando dispositivo para abrir a catraca: " + response[i].box_idbox)
            return;
         }
         var p = {}
         //LER RELAY
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "execute_actions", body: { 
            "actions": [
               {
                  "action": "sec_box",
                  "parameters": "id=65793,reason=3"
               }
            ]}}

         p.user_id = -1;
         p.tipo = 'ler_relay'
         console.log("ler relay")
         push_list.push(p)

         resolve(push_list)
      
         
      }
   })

}




let controlCopia = (response,device_list,push_list) =>{
   return new Promise((resolve, reject)=>{
      var dIndex = device_list.findIndex(x => x.id == response[0].id_terminal);
      if(dIndex==-1){
         reject("Dispositivo não encontrado")
         return;
      }
      if(push_list)
         var p = push_list.find(x => x.user_id == response[0].id);
      if(p!=undefined && p.user_id == response[0].id && p.devid ==device_list[dIndex].devid){
         reject("Aguardando dispositivo para copiar o usuário: "+response[0].id)
         return;
      }


      var p = {}
      //CREATE USER
      p.devid = device_list[dIndex].devid;
      p.request = { verb: "POST", endpoint: "create_objects", body: { 
         "object": "users",
         "values": [
         {
            "id":parseInt(response[0].id),
            "name": response[0].nome,
            "registration": response[0].documento,
         }
      ]}}
      p.user_id= parseInt(response[0].id);
      p.tipo = 'create_user'
      push_list.push(p)
      p ={}
      //USER GROUP
      p.devid = device_list[dIndex].devid;
      p.request = { verb: "POST", endpoint: "create_objects", body: { 
         "object": "user_groups",
         "values": [{"user_id": parseInt(response[0].id),"group_id": 1}]}}
      p.user_id= parseInt(response[0].id);
      p.tipo = 'create_group'
      push_list.push(p)
      p ={}


      if(response[0].fp){
         //CREATE TEMPLATE
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "templates",
            "values": [
               {
                  "user_id":parseInt(response[0].id),
                  "finger_type": 0,
                  "template": response[0].fp
               }
         ]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_template'
         push_list.push(p)
      }else{
         //CREATE CARD
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "cards",
            "values": [
               {
                   "value": parseInt(response[0].tag),
                   "user_id": parseInt(response[0].id)
               }
           ]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_card'
         push_list.push(p)
      }
      console.log("push copia")
      resolve(push_list)


   })

}

let controlApaga = (response,device_list,push_list) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
      var dIndex = device_list.findIndex(x => x.id == response[0].id_terminal);
      if(dIndex==-1){
         reject("Dispositivo não encontrado: "+response[0].id_terminal)
         return;
      }
      if(push_list)
         var p = push_list.find(x => x.user_id == response[0].id);
      if(p!=undefined && p.user_id == response[0].id && p.devid ==device_list[dIndex].devid){
         reject("Aguardando dispositivo para apagar o usuário: "+response[0].id)
         return;
      }
      var p = {}
      //DELETE USER
      p.devid = device_list[dIndex].devid;
      p.request = { verb: "POST", endpoint: "destroy_objects", body: { 
         "object": "users",
         "where": {
            "users": {
                "id": parseInt(response[0].id)
            }
        }}}

      p.user_id= parseInt(response[0].id);
      p.tipo = 'delete_user'
      console.log("push delete")
      push_list.push(p)

      resolve(push_list)
   
      
  
   })

}

let check_remote_state = (device_list,response) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
      var d = device_list.find(x => x.id == response[0].id_terminal);
        var url = 'http://'+d.ip+':'+d.port+'/remote_enroll.fcgi?session='+d.session;
        var loadobj = {
            "user_id": parseInt(response[0].id)
        }
        if(response){
         
             device(url,'objects_data','remote_enroll_async',null,loadobj).then(res=>{
               resolve (res)
             }).catch(error=>{
               reject (error)
             })         
     }
   })

}

 module.exports = {
    remote_digital,
    controlApaga,
    set_date,
    resolve_result,
    controlCopia,
    onlyUnique,
    ler_relay
 }