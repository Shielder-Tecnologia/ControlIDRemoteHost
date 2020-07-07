var sendJson = require('./send_json');
var macaddress = require('macaddress');

var url = "http://box.shielder.com.br/controle/"

// const mac = get_mac_address();

autorizaBox = (ip,serialnumber)=>{
    return new Promise((resolve,reject)=>{
        urlaut = url + "getAutorizaBox.php?mac=" + serialnumber + "&ip=" + ip;
        console.log(urlaut)
        sendJson.webAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
}


copiaMoradores = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getCopiaMoradores.php?mac=" + mac;
        sendJson.webAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            //console.log(response)
            reject (error)
            })
    })
    

}

lerDigital = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getCopiaMoradores.php?mac=" + mac;
        sendJson.webAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            //console.log(response)
            reject (error)
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