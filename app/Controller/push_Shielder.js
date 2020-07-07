var shielderweb = require('./shielder_web');
autorizaBox = function(ip,serialnumber){
    return new Promise((resolve,reject)=>{
        response = shielderweb.autorizaBox(ip,serialnumber).then(response=>{
            //console.log(ip,serialnumber)
            resolve(response)
        }).catch(response=>{
            reject(response)
        });
        
    })
}
module.exports = {
    autorizaBox
}