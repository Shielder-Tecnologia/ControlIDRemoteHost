'use strict'
const router = require('express').Router();

let _registerRoutes = (routes,method)=>{
    for(let key in routes){
        //Should not be an object, array or null
        if(typeof routes[key] === 'object' && routes[key]!== null && !(routes[key] instanceof Array)){
            //console.log(routes[key])
            //console.log(key)
            _registerRoutes(routes[key],key);
        } else { //when arrives to the paths, they are functions
            if(method === 'get'){
                router.get(key,routes[key]);
            }else if(method === 'post'){
                //do something
            }
        }
    }
}

let route = routes => {
    _registerRoutes(routes);
    return router;
}

module.exports = {
    route
}