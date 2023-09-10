'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging

from flask import request
from flask_restx import Resource

from src.api.apiConfig import api
from src.api.fitcrack.endpoints.notificationServices.responseModels import page_of_notification_services_model
from src.api.fitcrack.endpoints.notificationServices.argumentsParser import notification_services_parser
from src.database.models import FcNotificationService

log = logging.getLogger(__name__)
ns = api.namespace('notificationServices', description='Endpoints for notification services.')


@ns.route('')
class notification_services(Resource):
    @api.expect(notification_services_parser)
    @api.marshal_with(page_of_notification_services_model)
    def get(self):
        """
        Returns notification services
        """
        args = notification_services_parser.parse_args(request)
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)

        notification_services = FcNotificationService.query.paginate(page=page, per_page=per_page, error_out=True)
        print(notification_services)
        return notification_services