var create_users = {
	"object": "users",
	"values": [{}]
}

var load_users = {
	"object": "users"
}
var delete_user = {
	"object": "users"
}

var create_templates = {
	"object": "templates",
	"values": [{}]
}

var load_templates = { 
	"object": "templates"
}

var delete_templates = {
	"object": "templates"
}


var create_cards = {
	"object": "cards",
	"values": [{}]
}

var load_cards = { 
	"object": "cards"
}

var delete_card = {
	"object": "cards"
}

var remote_enroll_async = {
    "type": "biometry",
    "user_id": 43454336,
    "save": true,
    "sync": true,
}
objects_data = {
    create_users : create_users,
    load_users : load_users,
    delete_user : delete_user,
    create_templates : create_templates,
    load_templates : load_templates,
    delete_templates : delete_templates,
    create_cards: create_cards,
    load_cards : load_cards, 
    delete_card : delete_card,
	remote_enroll_async: remote_enroll_async
}
module.exports = objects_data

