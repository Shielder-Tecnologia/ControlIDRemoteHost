var sendJson = require('./send_json');
var url = "http://box.shielder.com.br/controle/"
// const mac = get_mac_address();

autorizaBox = (ip,serialnumber)=>{
    url = url + "getAutorizaBox.php?mac=" + serialnumber + "&ip=" + ip;

    sendJson.webFetch(url).then((response)=>{
        if(response.status==1){
            console.log(response.content)
            return response.content
        }else{
            console.log(response.error)
            return response.error
        }
    })
}


copiaMoradores = ()=>{
    url = url + "getCopiaMoradores.php?mac=" + mac;
    sendJson.webFetch(url).then((response)=>{
        if(response.status==1){
            console.log(response.content)
            return response.content
        }else{
            console.log(response.error)
            return response.error
        }
    })

}


apagaMoradores = ()=>{
    

}


autorizaMorador = (id,datetime,serial,ip)=>{
    

}


cadastraBio = (userid,id,serial,tipo)=>{
    

}


get_mac_address = ()=>{
    require('getmac').getMac(function(err,macAddress){
        if (err)  throw err
        console.log(macAddress)
        return macAddress
    })
}



module.exports = {
    autorizaBox,
    copiaMoradores,
    apagaMoradores,
    autorizaMorador,
    cadastraBio

}