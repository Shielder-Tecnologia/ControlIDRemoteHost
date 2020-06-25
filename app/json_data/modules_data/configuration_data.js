var get_config = {
    "general": [
        "online",
        "beep_enabled",
        "bell_enabled",
        "bell_relay",
        "local_identification",
        "exception_mode",
        "language",
        "daylight_savings_time_start",
        "daylight_savings_time_end",
        "auto_reboot"
    ],
    "mifare": ["byte_order"],
    "sec_box": ["out_mode"],
    "alarm": [
        "siren_enabled",
        "siren_relay"
    ],
    "identifier": [
        "verbose_logging",
        "log_type",
        "multi_factor_authentication"
    ],
    "bio_id": ["similarity_threshold_1ton"],
    "online_client": [
        "server_id", 
        "extract_template",
        "max_request_attempts"
    ],
    "bio_module": ["var_min"],
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


config_data = {
    get_config : get_config

}


module.exports = config_data

