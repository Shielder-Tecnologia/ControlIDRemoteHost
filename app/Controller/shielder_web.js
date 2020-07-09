var sendJson = require('./send_json');
var macaddress = require('macaddress');
var ip = require('ip');
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
        urlDig = url + "getLerDigital.php?mac=" + mac;
        sendJson.getAxios(urlDig).then((response)=>{
            //console.log(urlDig)
            resolve (response)
        }).catch(error=>{
            reject (error)
        })
    })
}

apagaMoradores = ()=>{
    

}

autorizaMorador = (id,datetime,serial)=>{
    return new Promise((resolve,reject)=>{
        
        urlaut = url + "getAutorizaMorador.php?mac=" + serial + "&biometria=" + id + "&data="+datetime;
        sendJson.getAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
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

get_local_ip = ()=>{
    return new Promise((resolve,reject)=>{
        ip = ip.address()
        if(ip)
            resolve(ip)
        else
            reject(ip)
    })
}

module.exports = {
    autorizaBox,
    copiaMoradores,
    apagaMoradores,
    autorizaMorador,
    cadastraBio,
    cadastraDigital,
    get_mac_address,
    lerDigital,
    get_local_ip

}