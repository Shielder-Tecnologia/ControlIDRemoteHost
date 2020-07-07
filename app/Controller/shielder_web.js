var sendJson = require('./send_json');
var macaddress = require('macaddress');

var url = "http://box.shielder.com.br/controle/"

// const mac = get_mac_address();

autorizaBox = (ip,serialnumber)=>{
    return new Promise((resolve,reject)=>{
        urlaut = url + "getAutorizaBox.php?mac=" + serialnumber + "&ip=" + ip;
        sendJson.getAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
}


copiaMoradores = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getCopiaMoradores.php?mac=" + mac;
        sendJson.getAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            //console.log(response)
            reject (error)
            })
    })
    

}

lerDigital = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getLerDigital.php?mac=" + mac;
        sendJson.getAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            reject (error)
            })
    })
}

apagaMoradores = ()=>{
    

}


autorizaMorador = (id,datetime,serial,ip)=>{
    

}

/**
 * @param {number}userid idusuario 
 * @param {number}id idusuario shielder
 * @param {string}serial serial dispositivo efetuada a operacao
 * @param {string}tipo remocao/cadastro
 */
cadastraBio = (userid,id,serial,tipo)=>{
    return new Promise((resolve,reject)=>{
        urlaut = url + "getCadastraBio.php?usuario=" + userid + "&id=" + id + "&mac="+serial +"&tipo="+tipo;
        sendJson.getAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })

}

cadastraDigital = (userid,id,serial,tipo,fp)=>{
    return new Promise((resolve,reject)=>{
        urlaut = url + "getCadastraBio.php?usuario=" + userid + "&id=" + id + "&mac="+serial +"&tipo="+tipo;
        data = {
            "fp":fp
        }
        var options = {
            url : urlaut,
            method: 'POST',
            timeout: 3000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
                data: data
        };
        sendJson.postAxios(options).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
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
    cadastraDigital,
    get_mac_address

}