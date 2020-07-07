var shielderweb = require('./shielder_web');

function copiaMoradores(mac){
    return new Promise((resolve,reject)=>{
        shielderweb.copiaMoradores(mac).then(response=>{
            //console.log(response)
            resolve (response)
        }).catch(response=>{
            reject(response)
        });
        
    })

}







module.exports = {
    copiaMoradores
}