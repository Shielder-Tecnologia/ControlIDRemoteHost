var sendJson = require('./send_json');
var macaddress = require('macaddress');

var url = "http://box.shielder.com.br/controle/"

// const mac = get_mac_address();

autorizaBox = (ip,serialnumber)=>{
    return new Promise((resolve,reject)=>{
        url = url + "getAutorizaBox.php?mac=" + serialnumber + "&ip=" + ip;

        sendJson.webAxios(url).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
}


copiaMoradores = ()=>{
    return new Promise((resolve,reject)=>{
        url = url + "getCopiaMoradores.php?mac=" + mac;
        sendJson.webAxios(url).then((response)=>{
            if(response.status==1){
                console.log(response.content)
                resolve (response.content)
            }else{
                console.log(response.error)
                reject (response.error)
            }
        })
    })
    

}


apagaMoradores = ()=>{
    

}


autorizaMorador = (id,datetime,serial,ip)=>{
    

}


cadastraBio = (userid,id,serial,tipo)=>{
    

}


get_mac_address = ()=>{
    return new Promise((resolve,reject)=>{
        macaddress.one().then(function (mac) {
            resolve(mac)
          }).catch(response=>{
              reject(response)
          });
    })
}



module.exports = {
    autorizaBox,
    copiaMoradores,
    apagaMoradores,
    autorizaMorador,
    cadastraBio,
    get_mac_address

}