const device =require('./contact_device')
const push_shielder =require('./push_Shielder')
var evilscan = require('evilscan')

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


 async function put_session(ip){
    var devices
    var device_list = []
    var options_scan = {
      target: '192.168.'+ip+'.0/24',
      port:'8000',
      status: 'O',
      banner:true,
      concurrency: '7000',
      json:true
   }
    try{
     devices = await get_ips(options_scan)
     //console.log(devices)
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
          d.session = session;
          if(d.session)
             device_list.push(d)
       }catch(e){
          throw TypeError("Não foi possível adquirir a sessão " + e);
       }
    }
    return device_list
 }

 


 let get_ips = (options_scan)=>{return new Promise((resolve,reject)=>{
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
}

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

 let set_monitor = (local_ip,item) =>{
   return new Promise((resolve, reject)=>{
      var url = 'http://'+item.ip+':'+item.port+'/set_configuration.fcgi?session='+ item.session;
      var loadobj = {
         "monitor": {
            "request_timeout": "5000",
		      "hostname": local_ip,
            "port": "3000"
         }
         
     }
      device(url,'monitor_data','activate_monitor',null,loadobj)
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

let get_devid = (item) =>{
   return new Promise((resolve, reject)=>{
      var url = 'http://'+item.ip+':'+item.port+'/load_objects.fcgi?session='+ item.session;
      device(url,'objects_data','load_device')
      .then(response=>{
         //console.log(response.devices[0].id)
         resolve (response.devices[0].id)
      })
      .catch(response=>{
         //console.log(response)
         reject (response)
      })
   })
}

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

let controlCopia = (device_list,response) =>{
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

let controlApaga = (device_list,response) =>{
   return new Promise((resolve, reject)=>{
      //console.log(device_list)
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
         }).catch(error=>{
            reject (error)
         })
          
      

      try{
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
    get_serial,
    put_session,
    get_session,
    set_monitor,
    get_devid,
    remote_digital,
    controlApaga,
    set_date
 }