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
})