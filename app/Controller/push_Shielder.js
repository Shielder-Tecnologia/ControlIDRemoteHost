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

cadastraBio = function(ip,serialnumber){
    return new Promise((resolve,reject)=>{
        shielderweb.cadastraBio(ip,serialnumber).then(response=>{
            //console.log(ip,serialnumber)
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
    autorizaBox
}