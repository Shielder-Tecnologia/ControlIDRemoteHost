const device =require('./contact_device')
const push_shielder =require('./push_Shielder')
var evilscan = require('evilscan')
//const { response } = require('express')

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


      
      
      
      //se push list n for nulo e tiver um endpoint valido
      if(push_list && push_list.length>0 && req.query.endpoint){         
         var pIndex = push_list.findIndex(x => x.uuid == req.query.uuid);         //acha o request que foi mandado
        
         if(pIndex!=-1){

            if(req.body.code == 1){
               if(req.body.error.indexOf('unique')>=0){
                  if(push_list[pIndex].user_id){
                     push_shielder.cadastraBio(push_list[pIndex].user_id,0,d.serial,'ENTRADA').then(res=>{
                        console.log("Usuario: "+push_list[pIndex].user_id+" ja existente")
                     }).catch(error=>{
                        reject(error)
                     })   
                  }
               }
            }




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
                        device.contBox = 1;
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

                  case "create_user_group":
                     console.log("grupo inserido");
                     break;
                  case "create_template":
                     
                     push_shielder.cadastraBio(push_list[pIndex].user_id,0,d.serial,'ENTRADA').then(res=>{
                        console.log("Usuario: "+push_list[pIndex].user_id+" criado")
                     }).catch(error=>{
                        reject(error)
                     })
                     break;
                  
                     case "hash_password":
                        var p = {};
                        p.devid = req.query.deviceId;
                        p.request = { verb: "POST", endpoint: "create_objects", body: { 
                           "object": "users",
                           "values": [
                           {
                              "id":parseInt(push_list[pIndex].user_id),
                              "name": push_list[pIndex].user_id.toString(),
                              "registration": "",
                              "password": response.password,
                              "salt": response.salt
                           }
                        ]}}
                        p.tipo = 'create_user_pass';
                        console.log(p.request.body)
                        p.user_id= push_list[pIndex].user_id;
                        push_list.push(p);
                        req.app.set('push_list',push_list);
                        p = {};


                        //USER GROUP
                        p.devid = req.query.deviceId;                        p.request = { verb: "POST", endpoint: "create_objects", body: { 
                           "object": "user_groups",
                           "values": [{"user_id": parseInt(push_list[pIndex].user_id),"group_id": 1}]}}
                        p.user_id= parseInt(push_list[pIndex].user_id);
                        p.tipo = 'create_user_group'
                        push_list.push(p)
                        p ={}
                        break;
                     
                  case "create_user_pass":
                  
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

                  case "message_to_screen":
                     console.log("Mensagem enviada!");
                     break;
                  case "set_push":
                     console.log("PUSH " + push_list[pIndex].devid+ " setado");
                     break;
                  case "get_system_information":
                     //var dtjson = 
                     var date = new Date(response.time * 1000);
                     // Hours part from the timestamp
                     var hours = date.getHours();
                     var dateNow = new Date();
                     var hourNow = dateNow.getHours();
                     if(hours+3!= hourNow){
                        console.log(hours+"  " + hourNow)
                        var p = {};
                        p.devid = req.query.deviceId;
                        var date2 = new Date()
                        data = {
                           "day": date2.getDate(),
                           "month": date2.getMonth()+1,
                           "year": date2.getFullYear(),
                           "hour": date2.getHours(),
                           "minute": date2.getMinutes(),
                           "second": date2.getSeconds()
                        }
                        p.request = { verb: "POST", endpoint: "set_system_time", body: data}
                        p.tipo = 'set_date';
                        push_list.push(p);
                        req.app.set('push_list',push_list);
                        p = {};
                     }
                     
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
                  "parameters": "id=65793,reason=3,timeout=3000"
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
      console.log(response);
      var dIndex = device_list.findIndex(x => x.id == response[0].id_terminal);
      if(dIndex==-1){
         reject("Dispositivo não encontrado")
         return;
      }
      if(push_list)
         var p = push_list.find(x => x.user_id == response[0].id);
      if(p!=undefined && p.user_id == response[0].id && p.devid == device_list[dIndex].devid){
         reject("Aguardando dispositivo para copiar o usuário: "+response[0].id)
         return;
      }


      var p = {}
      //CREATE USER
      var newdataInicio = 0;
      if(response[0].inicio){
         var dataInicio = response[0].inicio.split("/");
         var dia = parseInt(dataInicio[0] -1 );
         newdataInicio = new Date( dataInicio[2], dataInicio[1] - 1, dia.toString(), "21", "01");
         newdataInicio = parseInt(Math.round(newdataInicio.getTime())/1000);
      }else
         newdataInicio = 0;

      
      var newdataFim = 1921978800;
      if(response[0].fim){
         var dataFim = response[0].fim.split("/");
         newdataFim = new Date( dataFim[2], dataFim[1] - 1, dataFim[0], "20", "59");
         newdataFim = parseInt(Math.round(newdataFim.getTime())/1000);
      }else
         newdataFim = 1921978800;

      p.devid = device_list[dIndex].devid;
      if(response[0].descricao == "SENHA"){
         p.request = { verb: "POST", endpoint: "user_hash_password", body: { 
           "password": response[0].tag}}
         p.tipo = 'hash_password';
      }else{
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "users",
            "values": [
            {
               "id":parseInt(response[0].id),
               "name": response[0].nome,
               "registration": response[0].documento,
               "begin_time": newdataInicio,
               "end_time": newdataFim
            }
         ]}}
         p.tipo = 'create_user'
      }
      



      console.log(p.request.body)
      p.user_id= parseInt(response[0].id);
      //p.tipo = 'create_user'
      push_list.push(p)
      p ={}

      if(response[0].inicio){
         //GROUP
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "groups",
            "values": [{"id": parseInt(response[0].id),"name": response[0].id}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_group'
         push_list.push(p)
         p ={}
         // //USER GROUP
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "create_objects", body: { 
         //    "object": "user_groups",
         //    "values": [{"user_id": parseInt(response[0].id),"group_id": 1}]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_group'
         // push_list.push(p)
         // p ={}
         
            //USER GROUP
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "user_groups",
            "values": [{"user_id": parseInt(response[0].id),"group_id": parseInt(response[0].id)}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_user_group'
         push_list.push(p)
         p ={}

         //ACCESS RULE
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "access_rules",
            "values": [{"id": parseInt(response[0].id),"name": response[0].id, "type": 1,"priority": 0}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_access_rule'
         push_list.push(p)
         p ={}
         //PORTAL ACCESS RULE
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
         "object": "portal_access_rules",
         "values": [{"portal_id": 1,"access_rule_id": parseInt(response[0].id)}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_portal_access_rules'
         push_list.push(p)
         p ={}
         
         //GROUP ACCESS RULE
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "group_access_rules",
            "values": [{"group_id": parseInt(response[0].id),"access_rule_id":parseInt(response[0].id) }]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_group_access_rule'
         push_list.push(p)
         p ={}
         
         //TIME ZONES
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
         "object": "time_zones",
         "values": [{"id": parseInt(response[0].id),"name": response[0].id}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_time_zone'
         push_list.push(p)
         p ={}

         

         //TIME SPANS
         arrInicio = response[0].hr_inicio.split(':')
         hourInicio = arrInicio[0] *3600;
         minuteInicio = arrInicio[1] *60;
         
         arrFim = response[0].hr_fim.split(':')
         hourFim = arrFim[0] *3600;
         minuteFim = arrFim[1] *60;

         p.devid = device_list[dIndex].devid;
         

         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "time_spans",
            "values": [{
               "time_zone_id": parseInt(response[0].id),
               "start":hourInicio+minuteInicio,
               "end":hourFim + minuteFim,
               "sun": response[0].Domingo == "S" ? 1 : 0,
               "mon": response[0].Segunda == "S" ? 1 : 0,
               "tue": response[0].Terca == "S" ? 1 : 0,
               "wed": response[0].Quarta == "S" ? 1 : 0,
               "thu": response[0].Quinta == "S" ? 1 : 0,
               "fri":response[0].Sexta == "S" ? 1 : 0,
               "sat": response[0].Sabado == "S" ? 1 : 0,
               "hol1": 1,
               "hol2": 1,
               "hol3": 1
            }]}}

            console.log(p.request.body)
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_time_span'
         push_list.push(p)
         p ={}



         //ACCESS RULES TIME ZONES
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "access_rule_time_zones",
            "values": [{"access_rule_id": parseInt(response[0].id),"time_zone_id":parseInt(response[0].id)}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_access_rule_time_zone'
         push_list.push(p)
         p ={}
         // //USER ACCESS RULE
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "create_objects", body: { 
         //    "object": "user_access_rules",
         //    "values": [{"user_id": parseInt(response[0].id),"access_rule_id":parseInt(response[0].id) }]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_access_rule'
         // push_list.push(p)
         // p ={}

         // //USER ACCESS RULE
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "modify_objects", body: { 
         //    "object": "user_access_rules",
         //    "values": [{"user_id": parseInt(response[0].id),"access_rule_id":0 }]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_access_rule'
         // push_list.push(p)
         // p ={}
         
         //    //USER ACCESS RULE3
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "modify_objects", body: { 
         //    "object": "user_access_rules",
         //    "values": [{"user_id": parseInt(response[0].id),"access_rule_id":parseInt(response[0].id) }]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_access_rule'
         // push_list.push(p)
         // p ={}

         // //USER ACCESS RULE2
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "create_objects", body: { 
         //    "object": "user_access_rules",
         //    "values": [{"user_id": parseInt(response[0].id),"access_rule_id":0 }]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_access_rule'
         // push_list.push(p)
         // p ={}

         // //USER ACCESS RULE3
         // p.devid = device_list[dIndex].devid;
         // p.request = { verb: "POST", endpoint: "create_objects", body: { 
         //    "object": "user_access_rules",
         //    "values": [{"user_id": parseInt(response[0].id),"access_rule_id":parseInt(response[0].id) }]}}
         // p.user_id= parseInt(response[0].id);
         // p.tipo = 'create_user_access_rule'
         // push_list.push(p)
         // p ={}
      }else if(response[0].descricao != "SENHA"){

         //USER GROUP
         p.devid = device_list[dIndex].devid;
         p.request = { verb: "POST", endpoint: "create_objects", body: { 
            "object": "user_groups",
            "values": [{"user_id": parseInt(response[0].id),"group_id": 1}]}}
         p.user_id= parseInt(response[0].id);
         p.tipo = 'create_user_group'
         push_list.push(p)
         p ={}
      }

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
      }else if(response[0].tag && response[0].descricao != "SENHA"){
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