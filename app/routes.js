'use strict';
const router = require('express').Router();
var fetch = require('node-fetch');
module.exports = ()=>{
    let routes = {
        'get':{
            '/':(req,res,next) => {
                res.send("1");
            },
            '/all-config':(req,res,next) => {
                console.log(session_key)
                var data = 
                {
                    "monitor": [
                        "path",
                        "hostname",
                        "port",
                        "request_timeout"
                    ],
                    "push_server": [
                        "push_request_timeout",
                        "push_request_period",
                        "push_remote_address"
                    ]
                }

                var url = 'http://192.168.1.129:8000/get_configuration.fcgi?session='+session_key;
                var options = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                        body: JSON.stringify(data)
                }; 
                    (async () => {
                    const rawResponse = await fetch(url, options);
                    const content = await rawResponse.json();
                    console.log(content);
                    })();
                    res.send("1");
            }

        }

    }


    let registerRoutes = (routes,method)=>{
        for(let key in routes){
            //Should not be an object, array or null
            if(typeof routes[key] === 'object' && routes[key]!== null && !(routes[key] instanceof Array)){
                registerRoutes(routes[key],key);
            }else //when arrives to the paths, they are functions
            {
                if(method === 'get'){
                    router.get(key,routes[key])
                }
            }
        }
    }
registerRoutes(routes);
return router;
}