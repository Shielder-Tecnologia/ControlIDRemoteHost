const device =require('./contact_device')
const push_shielder =require('./push_Shielder')
var evilscan = require('evilscan')
const { response } = require('express')

var resolve_result = (req) =>{
   return new Promise((resolve, reject)=>{
      var push_list = req.app.get('push_list')
      var device_list = req.app.get('device_list')
      if(device_list)
         var d = device_list.find(x => x.devid == req.query.deviceId);

      var response = JSON.parse(req.body.response)
      //se push list n for nulo e tiver um endpoint valido
      if(push_list && req.query.endpoint){         
         var pIndex = push_list.findIndex(x => x.uuid == req.query.uuid);
         //acha o request que foi mandado
         if(pIndex!=-1){
            //verifica o que que foi mandado para o dispositivo executar, copia/apaga/pegar serial
            switch(push_list[pIndex].tipo){

               case "get_serial":
                  if(device_list || d == undefined){
                     var device = {}
                     device.devid = req.query.deviceId;
                     device.serial = response.serial;
                     device.ip = response.network.ip;
                     push_shielder.autorizaBox(device.ip,device.serial).then(idShielder=>{
                        device.id = idShielder;
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

               case "create_template":
                  console.log("Template criado ")

                  break;
               case "create_card":
                  console.log("Cartão criado ")
                  break; 

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



let remote_digital = (device_list,response) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
      var d = device_list.find(x => x.id == response[0].id_terminal);
      if(d==undefined)
         return 
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

let controlCopia = (response,device_list,push_list) =>{
   return new Promise((resolve, reject)=>{
      var dIndex = device_list.findIndex(x => x.id == response[0].id_terminal);
      if(dIndex==-1){
         reject("Dispositivo não encontrado")
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
      resolve(push_list)


   })

}

let controlApaga = (device_list,response) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
      var resp;
      var d = device_list.find(x => x.id == response[0].id_terminal);
      if(d==undefined)
         return
    var url = 'http://'+d.ip+':'+d.port+'/destroy_objects.fcgi?session='+d.session;
    var loadobj = {
        "where": {
            "users": {
                "id": parseInt(response[0].id)
            }
        }
    }
    
   
      
         device(url,'objects_data','delete_user',null,loadobj).then(res=>{
            resp = res
         }).catch(error=>{
            reject (error)
         })
          
      

      try{
         
            console.log("Usuario: "+response[0].id+" apagado")
            resolve (push_shielder.cadastraBio(response[0].id,0,d.serial,'SAIDA'))
         
      }catch(error){
          reject(error)
      }
  
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
    controlCopia
 }