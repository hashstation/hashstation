'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import fields

from src.api.apiConfig import api

settings_model = api.model('Settings', {
    'default_seconds_per_workunit': fields.Integer(),
    'workunit_timeout_factor': fields.Integer(),
    'hwmon_temp_abort': fields.Integer(),
    'bench_all': fields.Boolean(),
    'verify_hash_format': fields.Boolean(),
    'auto_add_hosts_to_running_jobs': fields.Boolean(),
    'bench_runtime_limit': fields.Integer(),
    'workunit_status_update': fields.Integer(),
    'discord_notifications': fields.Boolean(),
    'discord_webhook_id': fields.String(),
    'discord_webhook_token': fields.String(),
    'telegram_notifications': fields.Boolean(),
    'telegram_bot_token': fields.String(),
    'telegram_chat_id': fields.String(),
    'email_notifications': fields.Boolean(),
    'email_address': fields.String(),
    'email_password': fields.String(),
})