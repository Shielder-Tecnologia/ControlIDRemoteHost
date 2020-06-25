var activate_monitor= {
    "monitor": {
        "request_timeout": "1000",
        "hostname": "192.168.1.103",
        "port": "3000"
     }
     
}

var deactivate_monitor = {
	"monitor": {
		"hostname": "",
		"port": ""
	}
}
monitor = {
    activate_monitor : activate_monitor,
    deactivate_monitor : deactivate_monitor
}
module.exports = monitor

