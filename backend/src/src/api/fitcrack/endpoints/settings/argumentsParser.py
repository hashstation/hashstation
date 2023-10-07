'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import reqparse

settings_arguments = reqparse.RequestParser()
settings_arguments.add_argument('default_seconds_per_workunit', type=int, help='', required=False, location='json')
settings_arguments.add_argument('workunit_timeout_factor', type=int, help='', required=False, location='json')
settings_arguments.add_argument('hwmon_temp_abort', type=int, help='', required=False, location='json')
settings_arguments.add_argument('bench_all', type=bool, help='', required=False, location='json')
settings_arguments.add_argument('verify_hash_format', type=bool, help='', required=False, location='json')
settings_arguments.add_argument('auto_add_hosts_to_running_jobs', type=bool, help='', required=False, location='json')
settings_arguments.add_argument('bench_runtime_limit', type=int, help='', required=False, location='json')
settings_arguments.add_argument('workunit_status_update', type=int, help='', required=False, location='json')

settings_arguments.add_argument('discord_notifications', type=bool, help='', required=False, location='json')
settings_arguments.add_argument('discord_webhook_url', type=str, help='', required=False, location='json')

settings_arguments.add_argument('telegram_notifications', type=bool, help='', required=False, location='json')
settings_arguments.add_argument('telegram_bot_token', type=str, help='', required=False, location='json')
settings_arguments.add_argument('telegram_chat_id', type=str, help='', required=False, location='json')