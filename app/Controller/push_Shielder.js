var shielderweb = require('./shielder_web');
autorizaBox = function(ip,serialnumber){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaBox(ip,serialnumber).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

autorizaMorador = function(id,datetime,serial){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaMorador(id,datetime,serial).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

cadastraBio = function(userid,id,serialnumber,tipo){
    return new Promise((resolve,reject)=>{
        shielderweb.cadastraBio(userid,id,serialnumber,tipo).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}
cadastraDigital = function(userid,id,serial,tipo,fp){
    return new Promise((resolve,reject)=>{
        shielderweb.cadastraDigital(userid,id,serial,tipo,fp).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}



module.exports = {
    autorizaBox,
    cadastraDigital,
    autorizaMorador,
    cadastraBio
}