'use strict';
const util = require('../utils');
const device = require('../Controller/contact_device');
const push_Shielder = require('../Controller/push_Shielder');
const control = require('../Controller/controlServer');
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
                for (var i=0; i<device_list.length;i++){
                    var url = 'http://'+device_list[i].ip+':'+device_list[i].port+'/get_configuration.fcgi?session='+device_list[i].session;
                    device(url,'config_data','get_config').then(response=>{
                        console.log(response)
                    }).catch(response=>{
                        console.log(response)
                    })
                }
                 res.send()
                
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
            '/session-valid':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                 
                var url = 'http://'+req.app.get('ip_device')+':'+req.app.get('port_device')+'/session_is_valid.fcgi?session='+req.app.get('session_key');
                device(url,'system_data','session_is_valid');
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
                if(device_list)
                    var dIndex = device_list.findIndex(x => x.devid == req.query.deviceId);
                //se nao tiver nenhum device ou se n tiver o encontrado
                if(device_list.length == 0 || dIndex == -1){
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
                    // console.log("push_list")
                    // console.log(push_list)
                    req.app.set('push_list',push_list);
                }else{
                    //autorizabox para toda vez que um dispositivo der push
                    push_Shielder.autorizaBox(device_list[dIndex].ip,device_list[dIndex].serial).then(response=>{
                        console.log("Autoriza"+ response)
                        device_list[dIndex].lastOn = moment().valueOf();
                        //console.log(device_list[dIndex].lastOn)
                        //caso nao tenha sido registrado no shielder ele espera para colocar o id
                        if(device_list[dIndex].id<=4){
                            device_list[dIndex].id = response;
                            
                            req.app.set('device_list',device_list);
                        }
                        console.log("Lista de Dispositivos: "+ moment().format('MMMM Do YYYY, h:mm:ss a'))
                        console.log(device_list)
                        
                     }).catch(error=>{
                        reject(error)
                     })
                }

                for (var i=0; i<device_list.length;i++){
                    if(moment().valueOf() - device_list[dIndex].lastOn >300000){
                        device_list.splice(i,1);
                    }
                }


                
                if(push_list.length>0){
                    //seleciona qual comando enviar baseado em qual dispositivo fez o push
                    var index = push_list.findIndex(x => x.devid == req.query.deviceId);
                    if(index!= -1){
                        console.log(push_list)
                        push_list[index].uuid = req.query.uuid;
                        req.app.set('push_list',push_list);
                        res.status(200).json(push_list[index].request)
                    }else
                        res.send();
                }
                
            }
        },
        'post':{
            '/api/notifications/dao':(req,res,next) => {
                console.log("Morador: ");
                //console.log(req.body.object_changes[0].values);
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
                            date.getHours(),
                            date.getMinutes(),
                            date.getSeconds(),
                        ];
                        //('0' + deg).slice(-2)
                        //('0' + datevalues[1]).slice(-2)
                        var data = "'"+datevalues[0] + "-" + (('0' + datevalues[1]).slice(-2)) + "-" + (('0' + datevalues[2]).slice(-2)) + " " + (('0' + datevalues[3]).slice(-2))+":"+ (('0' + datevalues[4]).slice(-2)) + ":"+(('0' + datevalues[5]).slice(-2))+"'"
                        //console.log(data)
                        push_Shielder.autorizaMorador(req.body.object_changes[0].values.user_id, data , d.serial).then(response=>{
                            console.log("Morador: "+ req.body.object_changes[0].values.user_id + " - "+ data + " - "+ d.devid)
                        }).catch(error=>{
                            console.log(error)
                        })
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
                    control.resolve_result(req).then(index=>{
                        var push_list = req.app.get('push_list');
                        push_list.splice(index,1);
                        req.app.set('push_list', push_list);
                        res.send()
                    }).catch(error=>{
                        console.log("Erro " + error)

                    });
                }
                
            }
        }

    }


    return util.route(routes);
}