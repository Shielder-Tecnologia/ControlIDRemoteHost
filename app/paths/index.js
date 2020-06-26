'use strict';
const util = require('../utils');
const device = require('../Controller/contact_device');
module.exports = ()=>{
    let routes = {
        'get':{
            '/':(req,res,next)=>{
                res.send("1");
            },
            '/teste':(req,res,next) => {
                console.log("ola")
                res.send("1");
            },
            '/all-config':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                 
                var url = 'http://'+req.app.get('ip_device')+':'+req.app.get('port_device')+'/get_configuration.fcgi?session='+req.app.get('session_key');
                device(url,'config_data','get_config');
                res.send("1");
            },
            '/session-valid':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                 
                var url = 'http://'+req.app.get('ip_device')+':'+req.app.get('port_device')+'/session_is_valid.fcgi?session='+req.app.get('session_key');
                device(url,'system_data','session_is_valid');
                res.send("1");
            },
            '/load-users':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                 
                var url = 'http://'+req.app.get('ip_device')+':'+req.app.get('port_device')+'/load_objects.fcgi?session='+req.app.get('session_key');
                device(url,'objects_data','load_users');
                res.send("1");
            },
            '/api/notifications/dao':(req,res,next) => {
                //console.log(req.app.get('session_key'))
                console.log("Data: ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                console.log(req.body.object_changes[0].values);
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
                console.log("Data: ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                res.send();
            },
            '/api/notifications/template':(req,res,next) => {
                console.log("Data: ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                res.send();
            },
            '/api/notifications/card':(req,res,next) => {
                console.log("Data: ");
                console.log("Length: " + req.body.length);
                console.log(req.body);
                res.send();
            },
            
            

        },
        'post':{

        }

    }


    return util.route(routes);
}