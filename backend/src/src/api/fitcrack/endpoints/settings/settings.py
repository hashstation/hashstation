'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging

from flask import request
from flask_login import current_user
from flask_restx import Resource, abort
from sqlalchemy import exc

from src.api.apiConfig import api
from src.api.fitcrack.endpoints.settings.argumentsParser import settings_arguments
from src.api.fitcrack.endpoints.settings.responseModels import settings_model
from src.api.fitcrack.responseModels import simpleResponse
from src.database import db
from src.database.models import FcSettings

log = logging.getLogger(__name__)
ns = api.namespace('settings', description='Endpoints for manipulating system settings.')

@ns.route('')
class settings(Resource):

    @api.marshal_with(settings_model)
    def get(self):
        """
        Returns all system settings.
        """
        settings = FcSettings.query.filter_by(user_id=current_user.id).one_or_none()
        return settings

    @api.expect(settings_arguments)
    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Sets all system settings.
        """
        args = settings_arguments.parse_args(request)
        default_seconds_per_workunit = args['default_seconds_per_workunit'] 
        workunit_timeout_factor = args['workunit_timeout_factor']
        hwmon_temp_abort = args['hwmon_temp_abort']
        bench_all = args['bench_all']
        verify_hash_format = args['verify_hash_format']
        auto_add_hosts_to_running_jobs = args['auto_add_hosts_to_running_jobs']
        bench_runtime_limit = args['bench_runtime_limit']
        workunit_status_update = args['workunit_status_update']

        settings = FcSettings.query.filter_by(user_id=current_user.id).one_or_none()
        if not settings:
            abort(404, 'User settings not found.')
        if (default_seconds_per_workunit is not None): settings.default_seconds_per_workunit = default_seconds_per_workunit
        if (workunit_timeout_factor is not None): settings.workunit_timeout_factor = workunit_timeout_factor
        if (hwmon_temp_abort is not None): settings.hwmon_temp_abort = hwmon_temp_abort
        if (bench_all is not None): settings.bench_all = bench_all
        if (verify_hash_format is not None): settings.verify_hash_format = verify_hash_format
        if (auto_add_hosts_to_running_jobs is not None): settings.auto_add_hosts_to_running_jobs = auto_add_hosts_to_running_jobs
        if (bench_runtime_limit is not None): settings.bench_runtime_limit = bench_runtime_limit
        if (workunit_status_update is not None): settings.workunit_status_update = workunit_status_update
        db.session.commit()

        return {
            'status': True,
            'message': 'Settings saved.'
        }