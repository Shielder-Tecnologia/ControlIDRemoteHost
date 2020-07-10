var shielderweb = require('./shielder_web');
const device = require('./contact_device')
const push_shielder = require('./push_Shielder')

async function copiaMoradores(mac,device_list){
    var response = null
    try{
        response = await shielderweb.copiaMoradores(mac)
        if(!response)
            return
    }catch(error){
        throw Error(error)
    }
    
    var d = device_list.find(x => x.id == response[0].id_terminal);
    var url = 'http://'+d.ip+':'+d.port+'/create_objects.fcgi?session='+d.session;
    //console.log(d)
    
        var loadobj = {
            "values": [
                {
                    "id":parseInt(response[0].id),
                    "name": response[0].bloco,
                    "registration": response[0].documento,
                }
            ]
        }
        var res = null
        /**CREATE USER */
        try{
            res = await device(url,'objects_data','create_users',null,loadobj)
            var loadobj = {"values": [{"user_id": parseInt(response[0].id),"group_id": 1}]}
            await device(url,'objects_data','user_group',null,loadobj)
        }catch(error){
            throw Error(error)
        }
        // console.log("coco")
        if(res.hasOwnProperty('response'))
            if(!res.response.data.error==='constraint failed: PRIMARY KEY must be unique')
                throw Error('Erro ao adicionar usuario')
            
        
        /**CREATE TEMPLATE */
        var resp = null
        if(response[0].fp){
            var loadobj = {
                "values": [
                    {
                        "user_id":parseInt(response[0].id),
                        "finger_type": 0,
                        "template": response[0].fp
                    }
                ]
            }
            try{
                resp = await device(url,'objects_data','create_templates',null,loadobj)
            }catch(error){
                throw Error(error)
            }
            /**CREATE CARD */
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
                resp = await device(url,'objects_data','create_cards',null,loadobj)
                }catch(error){
                    throw Error(error)
                }            
        }
        //console.log(resp)
        /**CADASTRA BIO */
        if(resp!=null){
            try{
                console.log(response[0].id)
                return push_shielder.cadastraBio(response[0].id,0,d.serial,'ENTRADA')
            }catch(error){
                throw Error(error)
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
        return await shielderweb.apagaMoradores(mac)
    }catch(error){
        throw Error(error)
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