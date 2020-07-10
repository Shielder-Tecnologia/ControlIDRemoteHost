var shielderweb = require('./shielder_web');
const device = require('./contact_device')
const push_shielder = require('./push_Shielder')

async function copiaMoradores(mac,device_list){
    try{
        var response = await shielderweb.copiaMoradores(mac)
    }catch(error){
        throw Error(error)
    }

    var d = device_list.find(x => x.id == response[0].id_terminal);
    var url = 'http://'+d.ip+':'+d.port+'/create_objects.fcgi?session='+d.session;
    if(response){
        var loadobj = {
            "values": [
                {
                    "id":parseInt(response[0].id),
                    "name": response[0].name,
                    "registration": ""
                }
            ]
        }
        try{
            res = await device(url,'objects_data','create_users',null,loadobj)
            }catch(error){
                throw Error(error)
            }
        var res
        if(response[0].fp){
            var loadobj = {
                "values": [
                    {
                        "user_id":parseInt(response[0].id),
                        "finger_type": 0,
                        "template": response[0].fp,
                    }
                ]
            }
            try{
                res = await device(url,'objects_data','create_templates',null,loadobj)
                }catch(error){
                    throw Error(error)
                }
        }else{
            var loadobj = {
                "values": [
                    {
                        "value": parseInt(response[0].tag),
                        "user_id": parseInt(response[0].id)
                    }
                ]
            }
            try{
                res = await device(url,'objects_data','create_cards',null,loadobj)
                }catch(error){
                    throw Error(error)
                }            
        }
        if(res){
            try{
                return push_shielder.cadastraBio(response[0].user_id,0,d.serial,'ENTRADA')
            }catch(error){
                throw Error(error)
            }
        }
    }
}

async function lerDigital(mac){
    
    try{
       return await shielderweb.lerDigital(mac)
    }catch(error){
        throw Error(error)
    }
}


async function apagaMoradores(mac,device_list){
    
    try{
        var response = await shielderweb.apagaMoradores(mac)
    }catch(error){
        throw Error(error)
    }

    var d = device_list.find(x => x.id == response[0].id_terminal);
    var url = 'http://'+d.ip+':'+d.port+'/destroy_objects.fcgi?session='+d.session;
    var loadobj = {
        "where": {
            "users": {
                "id": parseInt(response[0].id)
            }
        }
    }
    
    
    if(response){
        var res
        try{
            res = await device(url,'objects_data','delete_user',null,loadobj)
            
        }catch(error){
            throw Error(error)
        }
        try{
            if(res)
                return push_shielder.cadastraBio(response[0].user_id,0,d.serial,'ENTRADA')
        }catch(error){
            throw Error(error)
        }
    }
    

}


module.exports = {
    copiaMoradores,
    lerDigital,
    apagaMoradores
}