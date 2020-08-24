var shielderweb = require('./shielder_web');
const device = require('./contact_device')
const push_shielder = require('./push_Shielder')

async function copiaMoradores(mac){
    try{
        return await shielderweb.copiaMoradores(mac)
    }catch(error){
        throw Error(error)
    }
    
}

async function lerDigital(mac){
    
    try{
       return await shielderweb.lerDigital(mac)
    }catch(error){
        throw Error(error)
    }
}


async function apagaMoradores(mac){
    
    try{
        return await shielderweb.apagaMoradores(mac)
    }catch(error){
        throw Error(error)
    }
}

async function lerRelay(mac){
    
    try{
        return await shielderweb.lerRelay(mac)
    }catch(error){
        throw Error(error)
    }
}


module.exports = {
    copiaMoradores,
    lerDigital,
    apagaMoradores,
    lerRelay
}