const dtjson = require('../json_data');
var sendJson = require('./send_json');
var pullshielder = require('./pull_shielder');


var call_device = function(url,keypath,key,subkey,paramObj)
{
    return new Promise((resolve,reject)=>{
        var data = dtjson(keypath,key,subkey);

        //verifica se o json é um objeto de objeto
        if(subkey){
            data1 = (data)
            subkeystr = (subkey)
            data = "{"+subkeystr + ":"+  data1+"}"
        }
        if(paramObj)
            data = Object.assign(data,paramObj)

        console.log(data)
        var options = {
            url : url,
            method: 'POST',
            timeout: 3000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
                data: data
        };
        //Envia o JSON para o dispositivo e obtem a resposta
        sendJson.dispAxios(options).then((response)=>{
            if(response){
                //console.log(response.content)
                resolve (response)
            }
        }).catch(response=>{
            reject (response)
        })
        })
}


module.exports = call_device