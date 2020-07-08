var activate_monitor= {
    "monitor": {
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

