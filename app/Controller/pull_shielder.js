var shielderweb = require('./shielder_web');
const device =require('./app/Controller/contact_device')
function copiaMoradores(mac,device_list){
    return new Promise((resolve,reject)=>{
        shielderweb.copiaMoradores(mac).then(response=>{
            //console.log(response)
            resolve (response)
        }).catch(response=>{
            reject(response)
        });
        
    })

}

function lerDigital(mac,device_list){
    return new Promise((resolve,reject)=>{
        shielderweb.lerDigital(mac).then(response=>{
            var url = 'http://'+device_list[0].ip+':'+device_list[0].port+'/load_objects.fcgi?session='+device_list[0].session;
                
            if(response){
                device()
            }
            resolve (response)
        }).catch(response=>{
            reject(response)
        });
        
    })

}





module.exports = {
    copiaMoradores,
    lerDigital
}