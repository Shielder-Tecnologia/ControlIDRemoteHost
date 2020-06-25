var set_net_config = {
	"ip": "192.168.110.200",
	"netmask": "255.255.128.0",
	"gateway": "192.168.0.1",
	"web_server_port": 80
}


system_data = {
    get_system_information : 0, 
	set_net_config : set_net_config,
	session_is_valid : 0
}


module.exports = system_data

