var shielderweb = require('./shielder_web');
autorizaBox = function(ip,serialnumber){
    return new Promise((resolve,reject)=>{
        response = shielderweb.autorizaBox(ip,serialnumber).then(response=>{
            resolve(response)
        });
        
    })
}
module.exports = {
    autorizaBox
}