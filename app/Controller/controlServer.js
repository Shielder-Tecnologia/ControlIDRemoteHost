const device =require('./contact_device')
const push_shielder =require('./push_Shielder')
const pull_shielder = require('./pull_shielder.js');
var evilscan = require('evilscan')
var device_list = []
var get_serial = (item) =>{
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
    return device_list
 }

 

var options_scan = {
    target: '192.168.0.0/24',
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

 let set_monitor = (item) =>{
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

 module.exports = {
    get_serial,
    put_session,
    get_session,
    set_monitor
 }