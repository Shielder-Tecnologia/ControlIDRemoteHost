'use strict';
const util = require('../utils');
const device = require('../Controller/contact_device');
const push_Shielder = require('../Controller/push_Shielder');
const control = require('../Controller/controlServer');
const dtjson = require('../json_data');
var moment = require('moment')

module.exports = ()=>{
    let routes = {
        'get':{
            '/':(req,res,next)=>{
                res.send("1");
            },
            '/activate-monitor':(req,res,next) => {
                var url = 'http://'+element.ip+':'+element.port+'/set_configuration.fcgi?session='+req.app.get('session_key');;
                device(url,'monitor_data','activate_monitor').then(response=>{
                    console.log(response)
                 }).catch(response=>{
                    console.log(response)
                 })
            },
            '/all-config':(req,res,next) => {
                var device_list = req.app.get('device_list')
                var push_list = req.app.get('push_list')
                for (var i=0; i<device_list.length;i++){
                    var p = {};
                    p.devid = device_list[i].devid;
                    //pegar o serial
                    p.request = { verb: "POST", endpoint: "get_configuration", body: { "monitor": [
                        "path",
                        "hostname",
                        "port",
                        "request_timeout"
                    ]}} 
                    p.tipo = 'get_config';
                    push_list.push(p);
                }
                req.app.set('push_list',push_list)
                
                res.send("1");
            },
            
            '/send-template':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                var device_list = req.app.get('device_list')
                
                var url = 'http://'+device_list[0].ip+':'+device_list[0].port+'/load_objects.fcgi?session='+device_list[0].session;
                
                var loadobj = {
                    "where":{
                        "templates":{
                            "user_id": 43454336
                        }
                    }
                }
                device(url,'objects_data','load_templates',null,loadobj).then(response=>{
                    console.log(response)
                 }).catch(response=>{
                    console.log(response)
                 })
                 res.send()
            },
            '/cadastrarSenha':(req,res,next) => {
                var device_list = req.app.get('device_list')
                var push_list = req.app.get('push_list')
                for (var i=0; i<device_list.length;i++){
                    var p = {};
                    p.devid = device_list[i].devid;
                    //pegar o serial
                    p.request = { verb: "POST", endpoint: "create_objects", body: { 
                        "object": "users",
                        "values": [
                        {
                           "id":parseInt("987123"),
                           "name": "TESTE SENHA",
                           "registration": "123124",
                           "password": "123456"
                        }
                     ]}}
                     p.user_id= parseInt("987123");
                     p.tipo = 'create_user';
                     console.log(p.request.body);
                    push_list.push(p);

                    p.devid = device_list[i].devid;
                    p.request = { verb: "POST", endpoint: "create_objects", body: { 
                       "object": "groups",
                       "values": [{"id": parseInt(987123),"name": "987123"}]}}
                    p.user_id= parseInt(987123);
                    p.tipo = 'create_group'
                    push_list.push(p)
                    p ={}

                    p.devid = device_list[i].devid;
                    p.request = { verb: "POST", endpoint: "create_objects", body: { 
                       "object": "user_groups",
                       "values": [{"user_id": parseInt(987123),"group_id": parseInt(987123)}]}}
                    p.user_id= parseInt(987123);
                    p.tipo = 'create_user_group'
                    push_list.push(p)
                    p ={}


                }
                req.app.set('push_list',push_list)
                
                res.send("1");
            },
            '/system-info':(req,res,next) => {
                var device_list = req.app.get('device_list')
                
                var url = 'http://'+device_list[0].ip+':'+device_list[0].port+'/set_configuration.fcgi?session='+device_list[0].session;
                device(url,'system_data','get_system_information').then(response=>{
                    console.log(response)
                 }).catch(response=>{
                    console.log(response)
                 })
                 res.send()
                
                res.send("1");
            },
            '/load-device':(req,res,next) => {
                var device_list = req.app.get('device_list')
                
                var url = 'http://'+device_list[0].ip+':'+device_list[0].port+'/load_objects.fcgi?session='+device_list[0].session;
                device(url,'objects_data','load_device').then(response=>{
                    console.log(response)
                 }).catch(response=>{
                    console.log(response)
                 })
                 res.send()
                
                res.send("1");
            },
            '/push':(req,res,next) => {
                console.log("PUSH:")
                var push_list = req.app.get('push_list')
                var device_list = req.app.get('device_list')

                data = device_list.filter(function( element ) {
                    return element !== undefined;
                 });

                if(device_list)
                    var dIndex = device_list.findIndex(x => x.devid == req.query.deviceId);
                
                
                /**Verifica se algum dispositivo foi desconectado */
                for (var i=0; i<device_list.length;i++){
                    if(device_list[i] && device_list[i].lastOn !== 'undefined'){
                        //console.log(device_list[i].id +" Last On ")
                        //console.log(device_list[i].id +" Tempo offline : "+ (moment().valueOf() - device_list[i].lastOn) / 1000+"s")
                        if(moment().valueOf() - device_list[i].lastOn >300000){
                            device_list.splice(i,device_list.length);
                        }
                    }
                }




                //se nao tiver nenhum device ou se n tiver o encontrado
                if(device_list.length == 0 || dIndex == -1){
                    /**verifica se tem algum duplicado na lista de push */
                    for(var i =0;i<push_list.length;i++){
                        if((push_list[i].tipo == 'set_monitor'|| push_list[i].tipo == 'get_serial') && push_list[i].devid == req.query.deviceId){
                            push_list.splice(index,1)
                        }
                    }
                    var p = {};
                    p.devid = req.query.deviceId;
                    //pegar o serial
                    p.request = { verb: "POST", endpoint: "system_information" }
                    p.tipo = 'get_serial';
                    push_list.push(p);
                    p = {};
                    //setar o monitor
                    p.devid = req.query.deviceId;
                    var host;
                    if(req.app.get('host')=='http://localhost:3000')
                        host = req.app.get('ip')
                    else
                        host = req.app.get('host')
                    p.request = { verb: "POST", endpoint: "set_configuration", body: { "monitor": {
                        "request_timeout": "15000",
                            "hostname": host,
                        "port": "3000",
                        "path":"api/notifications"
                        }}}
                    p.tipo = 'set_monitor';
                    push_list.push(p);
                    
                    control.get_request_set_relay(3000,req.query.deviceId,push_list).then(response=>{                                
                        push_list = response
                    }).catch(error=>{
                        console.log(error)
                    })
                    p = {};
                    
                    var p = {};
                    p.devid = req.query.deviceId;

                    p.request = { verb: "POST", endpoint: "set_configuration", body: { 	
                        "push_server": {
                            "push_request_timeout": "3000",
                            "push_request_period": "0.1",
                        }	
                        }}	
                    p.tipo = 'set_push';
                    push_list.push(p);
                    p = {};
                    //console.log("DEINDEX"+dIndex)
                    

                    
                    // console.log("push_list")
                    // console.log(push_list)
                    req.app.set('push_list',push_list);
                }else{
                    if(dIndex != -1 && device_list[dIndex].contBox % 14 == 0){
                    //autorizabox para toda vez que um dispositivo der push

                    var reqs = req.app.get('requisitions');
                    reqs++;
                    req.app.set('requisitions',reqs);
                    
                        push_Shielder.autorizaBox(device_list[dIndex].ip,device_list[dIndex].serial).then(response=>{
                            
                            console.log("Autoriza "+ response)
                            device_list[dIndex].lastOn = moment().valueOf();
                            //console.log(device_list[dIndex].lastOn)
                            
                            // verifica se tem ; para mudar o timeout_relay
                            if(!Number.isInteger(device_list[dIndex].id) && response.indexOf(';')>=0){
                                
                                if(device_list[dIndex].timeout == 3000){
                                    var id = response.split(";")
                                    device_list[dIndex].timeout = 0;

                                    control.get_request_set_relay(0,device_list[dIndex].devid,push_list).then(response=>{                                
                                        push_list = response
                                    }).catch(error=>{
                                        console.log(error)
                                    })
                                }       
                            }else if(device_list[dIndex].timeout == 0){
                                device_list[dIndex].timeout = 3000;

                                control.get_request_set_relay(3000,device_list[dIndex].devid,push_list).then(response=>{                                
                                    push_list = response
                                }).catch(error=>{
                                    console.log(error)
                                })
                            }



                            //caso nao tenha sido registrado no shielder ele espera para colocar o id
                            if(!Number.isInteger(device_list[dIndex].id) || device_list[dIndex].id<=4){
                                if(!Number.isInteger(response)){
                                    if(response.indexOf(';')>=0){
                                        var id = response.split(";")
                                        device_list[dIndex].id = id[0];
                                        device_list[dIndex].timeout = 0;
                                        control.get_request_set_relay(0,device_list[dIndex].devid,push_list).then(response=>{                                
                                            push_list = response
                                        }).catch(error=>{
                                            console.log(error)
                                        })
                                    }
                                }else{
                                    device_list[dIndex].id = response;
                                }
                                req.app.set('device_list',device_list);
                            }

                            
                            req.app.set('push_list',push_list);
                        }).catch(error=>{
                            console.log(error)
                        })
                    }
                    device_list[dIndex].contBox++;

                    //Verificar a data se esta certa
                    if(dIndex != -1 && device_list[dIndex].contBox>=720){
                        //TODO TESTAR
                        
                        var p = {};
                        p.devid = req.query.deviceId;
                        
                        data = dtjson('system_data','get_system_information')
                        p.request = { verb: "POST", endpoint: "system_information", body: data}
                        p.tipo = 'get_system_information';
                        push_list.push(p);
                        p = {};
                        device_list[dIndex].contBox =0;
                        //req.app.set('device_list',device_list);
                    }
                    req.app.set('device_list',device_list);

                }

                

                push_list = push_list.filter(control.onlyUnique); // se tiver comandos duplicados ele filtra
                
                if(push_list.length>0){
                    //seleciona qual comando enviar baseado em qual dispositivo fez o push
                    var index = push_list.findIndex(x => x.devid == req.query.deviceId);
                    if(index!= -1){
                        
                        push_list[index].uuid = req.query.uuid;
                        req.app.set('push_list',push_list);
                        console.log("Lista Push")
                        console.log(push_list)
                        res.status(200).json(push_list[index].request)
                    }else
                        res.send();
                }
                
            }
        },
        'post':{
            '/api/notifications/dao':(req,res,next) => {
                console.log("Morador: ");
                console.log(req.body.object_changes[0].values);
                var push_list = req.app.get('push_list')
                var device_list = req.app.get('device_list')
                var d = device_list.find(x => x.devid == req.body.device_id);
                if(d){
                    if(req.body.object_changes[0].object == 'templates' || req.body.object_changes[0].object == 'cards'){
                    }else{
                        
                        var date = new Date(req.body.object_changes[0].values.time*1000);
                        var datevalues = [
                            date.getFullYear(),
                            date.getMonth()+1,
                            date.getDate(),
                            date.getHours() +3,
                            date.getMinutes(),
                            date.getSeconds(),
                        ];
                        //('0' + deg).slice(-2)
                        //('0' + datevalues[1]).slice(-2)
                        var data = "'"+datevalues[0] + "-" + (('0' + datevalues[1]).slice(-2)) + "-" + (('0' + datevalues[2]).slice(-2)) + " " + (('0' + datevalues[3]).slice(-2))+":"+ (('0' + datevalues[4]).slice(-2)) + ":"+(('0' + datevalues[5]).slice(-2))+"'"
                        
                        if(req.body.object_changes[0].values.user_id && req.body.object_changes[0].values.user_id!= 0 ){
                            
                            var reqs = req.app.get('requisitions');
                            reqs++;
                            req.app.set('requisitions',reqs);

                            push_Shielder.autorizaMorador(req.body.object_changes[0].values.user_id, data , d.serial, "0").then(response=>{                                
                                
                                //funcionalidade controle de vaga
                                if(d.timeout == 0)
                                {
                                    var stringRes = '' + response;
                                    var charZro = stringRes.charAt(0);
                                    if(charZro > 0)
                                    {
                                        hexString = req.body.object_changes[0].values.identifier_id.toString(16);
                                        var last2 = hexString.slice(-2);
                                        porta = parseInt(last2, 16);

                                        control.post_request_open_relay(d.devid,push_list,porta,"ACESSO LIBERADO").then(response=>{                                
                                            console.log("OPEN relay "+ response)
                                            push_list = response;
                                            req.app.set('push_list',push_list);
                                        }).catch(error=>{
                                            console.log(error)
                                        })
                                    }
                                }

                                
                                console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                            }).catch(error=>{
                                console.log(error)
                            })
                        }else{
                            //console.log("Tamanho cardvalue"+ req.body.object_changes[0].values.card_value.length)
                            if(req.body.object_changes[0].values.card_value.length >= 10 && req.body.object_changes[0].values.card_value.length <= 12){
                                
                                var codigo = req.body.object_changes[0].values.card_value;
                                if(req.body.object_changes[0].values.card_value.length == 10)
                                {
                                    codigo = "00" + req.body.object_changes[0].values.card_value;
                                }
                                else if(req.body.object_changes[0].values.card_value.length == 11)
                                {
                                    codigo = "0"+ req.body.object_changes[0].values.card_value;
                                }

                                var reqs = req.app.get('requisitions');
                                reqs++;
                                req.app.set('requisitions',reqs);
                                push_Shielder.autorizaVisitante(req.body.object_changes[0].values.user_id, data , d.serial,codigo).then(response=>{
                                    console.log("autorizaVisitante ticket" + response);
                                    var stringRes = '' + response;
                                    
                                    var charZro = stringRes.charAt(0);
                                    if(charZro > 0){
                                        //mensagem
                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "message_to_screen");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Não foi possível enviar mensagem: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "message_to_screen", body: { 
                                                "message": "TICKET LIBERADO",
                                                "timeout": 5000
                                            }}

                                        p.user_id = -1;
                                        p.tipo = 'message_to_screen'
                                        //console.log("relay aberto")
                                        
                                        push_list.push(p)
                                        //req.app.set('push_list',push_list);


                                        //ler relay
                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "ler_relay");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Aguardando dispositivo para abrir a catraca: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "execute_actions", body: { 
                                            "actions": [
                                            {
                                                "action": "sec_box",
                                                "parameters": "id=65793,reason=3,timeout=3000"
                                            }
                                            ]}}

                                        p.user_id = -1;
                                        p.tipo = 'ler_relay'
                                        console.log("relay aberto")
                                        push_list.push(p)
                                        req.app.set('push_list',push_list);
                                    }

                                    
                                    console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                                }).catch(error=>{
                                    console.log(error)
                                })
                            }else if(req.body.object_changes[0].values.card_value.length == 13 || req.body.object_changes[0].values.card_value.length == 4){
                                var reqs = req.app.get('requisitions');
                                reqs++;
                                req.app.set('requisitions',reqs);

                                push_Shielder.autorizaFuncionario(req.body.object_changes[0].values.user_id, data , d.serial,req.body.object_changes[0].values.card_value).then(response=>{
                                    
                                    console.log("autorizaFuncionario crachá" + response);
                                    
                                    var stringRes = '' + response;
                                    var charZro = stringRes.charAt(0);
                                    
                                    if(charZro > 0){
                                        //mensagem
                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "message_to_screen");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Não foi possível enviar mensagem: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "message_to_screen", body: { 
                                                "message": "CRACHÁ LIBERADO",
                                                "timeout": 5000
                                            }}

                                        p.user_id = -1;
                                        p.tipo = 'message_to_screen'
                                        //console.log("relay aberto")
                                        
                                        push_list.push(p)
                                        //req.app.set('push_list',push_list);



                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "ler_relay");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Aguardando dispositivo para abrir a catraca: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "execute_actions", body: { 
                                            "actions": [
                                            {
                                                "action": "sec_box",
                                                "parameters": "id=65793,reason=3,timeout=3000"
                                            }
                                            ]}}

                                        p.user_id = -1;
                                        p.tipo = 'ler_relay'
                                        console.log("relay aberto")
                                        push_list.push(p)
                                        req.app.set('push_list',push_list);
                                    }

                                    
                                    console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                                }).catch(error=>{
                                    console.log(error)
                                })
                            }
                            else if(req.body.object_changes[0].values.card_value.length == 15){
                                var reqs = req.app.get('requisitions');
                                reqs++;
                                req.app.set('requisitions',reqs);
                                push_Shielder.controleAutorizaVisitante(req.body.object_changes[0].values.user_id, data , d.serial,req.body.object_changes[0].values.card_value).then(response=>{
                                    console.log("controleAutorizaVisitante convite" + response);

                                    var stringRes = '' + response;
                                    var charZro = stringRes.charAt(0);
                                    
                                    if(charZro > 0){

                                        //mensagem
                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "message_to_screen");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Não foi possível enviar mensagem: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "message_to_screen", body: { 
                                                "message": "CONVITE LIBERADO",
                                                "timeout": 5000
                                            }}

                                        p.user_id = -1;
                                        p.tipo = 'message_to_screen'
                                        //console.log("relay aberto")
                                        
                                        push_list.push(p)
                                        //req.app.set('push_list',push_list);

                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "ler_relay");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Aguardando dispositivo para abrir a catraca: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "execute_actions", body: { 
                                            "actions": [
                                            {
                                                "action": "sec_box",
                                                "parameters": "id=65793,reason=3,timeout=3000"
                                            }
                                            ]}}

                                        p.user_id = -1;
                                        p.tipo = 'ler_relay'
                                        console.log("relay aberto")
                                        push_list.push(p)
                                        req.app.set('push_list',push_list);
                                    }

                                    
                                    console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                                }).catch(error=>{
                                    console.log(error)
                                })
                            }
                            else if(req.body.object_changes[0].values.card_value.length == 17){
                                var codigo = req.body.object_changes[0].values.card_value.slice(0,9);
                                var reqs = req.app.get('requisitions');
                                reqs++;
                                req.app.set('requisitions',reqs);
                                push_Shielder.autorizaMorador(req.body.object_changes[0].values.user_id, data ,d.serial, codigo).then(response=>{
                                    
                                    console.log("autorizaMorador QR code");
                                    console.log(response)
                                    
                                    var stringRes = '' + response;
                                    var charZro = stringRes.charAt(0);
                                    
                                    if(charZro > 0){
                                        //mensagem
                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "message_to_screen");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Não foi possível enviar mensagem: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "message_to_screen", body: { 
                                                "message": "MORADOR LIBERADO",
                                                "timeout": 5000
                                            }}

                                        p.user_id = -1;
                                        p.tipo = 'message_to_screen'
                                        //console.log("relay aberto")
                                        
                                        push_list.push(p)
                                        //req.app.set('push_list',push_list);


                                        if(push_list)
                                            var p = push_list.find(x => x.tipo == "ler_relay");
                                        if(p!=undefined &&  p.devid == d.devid){
                                            reject("Aguardando dispositivo para abrir a catraca: ")
                                            return;
                                        }
                                        var p = {}
                                        //LER RELAY
                                        p.devid = d.devid;
                                        p.request = { verb: "POST", endpoint: "execute_actions", body: { 
                                            "actions": [
                                            {
                                                "action": "sec_box",
                                                "parameters": "id=65793,reason=3,timeout=3000"
                                            }
                                            ]}}

                                        p.user_id = -1;
                                        p.tipo = 'ler_relay'
                                        console.log("relay aberto")
                                        push_list.push(p)
                                        req.app.set('push_list',push_list);
                                    }

                                    
                                    console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                                }).catch(error=>{
                                    console.log(error)
                                })
                            }
                        }
                    }
                }else
                    console.log('Não encontrado na lista de dispositivos')
                //console.log(req.body.object_changes[0].values);
                
                res.send();
            },
            '/api/notifications/catra_event':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                console.log("Catra event: ");
                var date = new Date((req.body.event.time+3*60*60) * 1000);
                console.log("Time: " + dateFormat(date, '[HH:MM:ss.l]'));
                
                console.log(req.body);
                res.send();
            },
            '/api/notifications/operation_mode':(req,res,next) => {
                console.log(": ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                res.send();
            },
            '/api/notifications/template':(req,res,next) => {
                var device_list = req.app.get('device_list')
                var d = device_list.find(x => x.devid == req.body.device_id);
                push_Shielder.cadastraDigital(0,req.body.user_id, d.serial,'ENTRADA',req.body.template).then(response=>{
                    req.app.set('mutex_Ler',true)
                    console.log("Digital Cadastrada")
                    console.log(response)
                }).catch(error=>{
                    console.log(error)
                })
                // console.log("Length: " + req.body.length);
                // console.log(req.body);
                
                res.send();
            },
            '/api/notifications/card':(req,res,next) => {
                console.log(": ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                res.send();
            },
            '/result':(req,res,next) => {
                if(req.body!=null || req.body!=undefined){
                    console.log("RESULT:")
                    console.log(req.body)
                    control.resolve_result(req).then(index=>{ //retorna o index para ser removido
                        var push_list = req.app.get('push_list');
                        console.log("Item computado:")
                        console.log(push_list[index])
                        push_list.splice(index,1);
                        req.app.set('push_list', push_list);
                        
                        res.send()
                    }).catch(error=>{
                        console.log("Erro no Resultado" + error)

                    });
                }
                
            }
        }

    }


    return util.route(routes);
}