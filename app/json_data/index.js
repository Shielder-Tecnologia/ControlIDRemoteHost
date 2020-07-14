const monitor_data= require('./modules_data/monitor_data');
const system_data= require('./modules_data/system_data');
const config_data= require('./modules_data/configuration_data');
const objects_data= require('./modules_data/objects_data');
var DictData = 
{
    monitor_data,
    system_data,
    config_data,
    objects_data
}




module.exports = (keypath,key,subkey)=>
{
    if(subkey)
        return DictData[keypath][key][subkey]
    else
        return DictData[keypath][key]
}


