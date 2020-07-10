var create_users = {
	"object": "users",
}

var load_users = {
	"object": "users"
}
var delete_user = {
	"object": "users"
}

var create_templates = {
	"object": "templates"
}

var load_templates = { 
	"object": "templates"
}

var delete_templates = {
	"object": "templates"
}


var create_cards = {
	"object": "cards",
}

var load_cards = { 
	"object": "cards"
}

var delete_card = {
	"object": "cards"
}

var remote_enroll_async = {
    "type": "biometry",
    "save": true,
    "sync": false,
    "panic_finger": 0
}

var load_device = { 
	"object": "devices"
}
objects_data = {
    create_users : create_users,
    load_users : load_users,
    delete_user : delete_user,
    create_templates : create_templates,
    load_templates : load_templates,
    delete_templates : delete_templates,
    create_cards : create_cards,
    load_cards : load_cards, 
    delete_card : delete_card,
    remote_enroll_async: remote_enroll_async,
    load_device : load_device
    
}
module.exports = objects_data

