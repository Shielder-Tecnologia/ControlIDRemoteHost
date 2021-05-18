var shielderweb = require('./shielder_web');
autorizaBox = function(ip,serialnumber, ipremoto){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaBox(ip,serialnumber, ipremoto).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

autorizaMorador = function(id,datetime,serial,codigo){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaMorador(id,datetime,serial,codigo).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

cadastraBio = function(userid,id,serialnumber,tipo,descricao){
    return new Promise((resolve,reject)=>{
        shielderweb.cadastraBio(userid,id,serialnumber,tipo,descricao).then(response=>{
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
controleAutorizaVisitante = function(id,datetime,serial,codigo){
    return new Promise((resolve,reject)=>{
        shielderweb.controleAutorizaVisitante(id,datetime,serial,codigo).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

autorizaFuncionario = function(id,datetime,serial,codigo){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaFuncionario(id,datetime,serial,codigo).then(response=>{
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}

autorizaVisitante = function(id,datetime,serial,codigo){
    return new Promise((resolve,reject)=>{
        shielderweb.autorizaVisitante(id,datetime,serial,codigo).then(response=>{
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
    cadastraBio,
    controleAutorizaVisitante,
    autorizaFuncionario,
    autorizaVisitante
}