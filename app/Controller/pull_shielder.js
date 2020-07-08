var shielderweb = require('./shielder_web');
const device = require('./contact_device')
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

async function lerDigital(mac,device_list){
    
        try{
        var response = await shielderweb.lerDigital(mac)
        }catch(error){
            throw Error(error)
        }
            var d = device_list.find(x => x.id == response[0].id_terminal);
            var url = 'http://'+d.ip+':'+d.port+'/load_objects.fcgi?session='+d.session;
            var loadobj = {
                "user_id": 43454336
            }
        
        
        if(response){
            try{
            res = await device(url,'objects_data','remote_enroll_async',null)
                console.log(res)
                return res;
            }catch(error){
                throw Error(error)
            }
            
        }
            
        

}





module.exports = {
    copiaMoradores,
    lerDigital
}