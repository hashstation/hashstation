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
from src.database.models import FcSettings, FcNotification

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

        discord_notifications = args['discord_notifications']
        discord_webhook_id = args['discord_webhook_id']
        discord_webhook_token = args['discord_webhook_token']
        telegram_notifications = args['telegram_notifications']
        telegram_bot_token = args['telegram_bot_token']
        telegram_chat_id = args['telegram_chat_id']
        email_notifications = args['email_notifications']
        email_address = args['email_address']
        email_password = args['email_password']

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

        if discord_notifications:
            if not discord_webhook_id:
                abort(400, 'Discord webhook ID is required when enabling Discord notifications.')
            if not discord_webhook_token:
                abort(400, 'Discord webhook token is required when enabling Discord notifications.')
            
            if not settings.discord_notifications: # If discord notifications were previously disabled, mark all notifications as sent
                FcNotification.query.filter(FcNotification.user_id == current_user.id).update({FcNotification.discord_sent: True})

            settings.discord_notifications = discord_notifications

        if telegram_notifications:
            if not telegram_bot_token:
                abort(400, 'Telegram bot token is required when enabling Telegram notifications.')
            if not telegram_chat_id:
                abort(400, 'Telegram chat ID is required when enabling Telegram notifications.')
            
            if not settings.telegram_notifications:
                FcNotification.query.filter(FcNotification.user_id == current_user.id).update({FcNotification.telegram_sent: True})

            settings.telegram_notifications = telegram_notifications

        if email_notifications:
            if not email_address:
                abort(400, 'E-mail address is required when enabling E-mail notifications.')
            if not email_password:
                abort(400, 'E-mail password is required when enabling E-mail notifications.')
            if not "@" in email_address:
                abort(400, 'Invalid e-mail address.')

            if not settings.email_notifications:
                FcNotification.query.filter(FcNotification.user_id == current_user.id).update({FcNotification.email_sent: True})

            settings.email_notifications = email_notifications

        if discord_webhook_id: 
            settings.discord_webhook_id = discord_webhook_id
        if discord_webhook_token:
            settings.discord_webhook_token = discord_webhook_token
        if telegram_bot_token:
            settings.telegram_bot_token = telegram_bot_token
        if telegram_chat_id:
            settings.telegram_chat_id = telegram_chat_id
        if email_address:
            settings.email_address = email_address
        if email_password:
            settings.email_password = email_password

        db.session.commit()

        return {
            'status': True,
            'message': 'Settings saved.'
        }