var sendJson = require('./send_json');
var macaddress = require('macaddress');
var ip = require('ip');
var qs = require('qs');


var url = "http://box.shielder.com.br/controle/"

// const mac = get_mac_address();

autorizaBox = (ip,serialnumber, ipremoto)=>{
    return new Promise((resolve,reject)=>{
        urlaut = url + "getAutorizaBox.php?mac=" + serialnumber + "&ip=" + ip + "&ipremoto" + ipremoto;
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

apagaMoradores = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getApagaMoradores.php?mac=" + mac;
        sendJson.getAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            //console.log(response)
            reject (error)
            })
    })

}

lerRelay = (mac)=>{
    return new Promise((resolve,reject)=>{
        urlcopia = url + "getLerRelay.php?mac=" + mac;
        sendJson.getAxios(urlcopia).then((response)=>{
            resolve (response)
            }).catch(error=>{
            //console.log(response)
            reject (error)
            })
    })

}

autorizaMorador = (id,datetime,serial,codigo)=>{
    return new Promise((resolve,reject)=>{
        if(id){
            urlaut = url + "getAutorizaMorador.php?mac=" + serial + "&biometria=" + id + "&data="+datetime +"&codigo="+codigo;
            //console.log("morador")
            console.log(urlaut)
            sendJson.getAxios(urlaut).then(response=>{                
                resolve (response);
            }).catch(response=>{
                reject (response);
            })
        }
        else{
            urlaut = url + "getAutorizaMorador.php?mac=" + serial +"&data="+datetime +"&codigo="+codigo;
            //console.log("morador")
            console.log(urlaut)
            sendJson.getAxios(urlaut).then(response=>{                
                resolve (response);
            }).catch(response=>{
                reject (response);
            })
        }
    })
}

controleAutorizaVisitante = (id,datetime,serial,codigo)=>{
    return new Promise((resolve,reject)=>{
        
        urlaut = url + "controleAutorizaVisitante.php?mac=" + serial + "&data="+datetime +"&codigo="+codigo;
        //console.log("morador")
        console.log(urlaut)
        sendJson.getAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
}

autorizaVisitante = (id,datetime,serial,codigo)=>{
    return new Promise((resolve,reject)=>{
        
        urlaut = url + "getAutorizaVisitante.php?mac=" + serial + "&data="+datetime +"&codigo="+codigo;
        //console.log("morador")
        console.log(urlaut)
        sendJson.getAxios(urlaut).then(response=>{                
            resolve (response);
        }).catch(response=>{
            reject (response);
        })
    })
}

autorizaFuncionario = (id,datetime,serial,codigo)=>{
    return new Promise((resolve,reject)=>{
        
        urlaut = url + "getAutorizaFuncionario.php?mac=" + serial + "&data="+datetime +"&codigo="+codigo;
        //console.log("morador")
        console.log(urlaut)
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
        //console.log(urlaut);
        data = {
            "fp":fp
        }
        //console.log(fp)
        var options = {
            url : urlaut,
            method: 'POST',
            timeout: 3000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            
                data: qs.stringify(data)
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
    controleAutorizaVisitante,
    autorizaFuncionario,
    autorizaVisitante,
    cadastraBio,
    cadastraDigital,
    get_mac_address,
    lerDigital,
    get_local_ip,
    lerRelay,


}