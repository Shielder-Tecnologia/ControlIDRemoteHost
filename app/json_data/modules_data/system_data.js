 
var set_net_config = {
	"ip": "192.168.110.200",
	"netmask": "255.255.128.0",
	"gateway": "192.168.0.1",
	"web_server_port": 80
}

var login = {"login":"admin","password":"admin"}

var set_date = ()=>{
	var date = new Date()
	
	data = {
		"day": date.getDate(),
		"month": date.getMonth()+1,
		"year": date.getFullYear(),
		"hour": date.getHours(),
		"minute": date.getMinutes(),
		"second": date.getSeconds()
	}
	return data
}


system_data = {
    get_system_information : "", 
	set_net_config : set_net_config,
	session_is_valid : 0,
	login : login,
	set_date : set_date()
}


module.exports = system_data

