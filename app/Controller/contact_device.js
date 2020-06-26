const dtjson = require('../json_data');
var sendJson = require('./send_json');
var pullshielder = require('./pull_shielder');



module.exports = async (url,keypath,key,subkey)=>{
    //Pega do Dicionario o json que a funcao requer
    var data = dtjson(keypath,key,subkey);

    //verifica se o json é um objeto de objeto
    if(subkey){
        data1 = JSON.stringify(data)
        subkeystr = JSON.stringify(subkey)
        data = "{"+subkeystr + ":"+  data1+"}"
    }else
        data = (JSON.stringify(data))
    
    var options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
            body: data
    };
    //Envia o JSON para o dispositivo e obtem a resposta
    await sendJson.dispFetch(url,options).then((response)=>{
        if(response.status==1){
            console.log(response.content)
            return response.content
        }else{
            console.log(response.error)
            return response.error
        }
    }).catch(response=>{
        console.log(response)
        return response
    })
    
}