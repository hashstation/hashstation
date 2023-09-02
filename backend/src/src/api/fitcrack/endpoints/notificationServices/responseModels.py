'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import fields

from src.api.apiConfig import api
from src.api.fitcrack.responseModels import pagination

notification_service_model = api.model('Notification service', {
    'service': fields.String(),
    'service_name': fields.String(),
    'target': fields.String(),
    'target_name': fields.String(),
    'app_password': fields.String(),
    'last_notification_id': fields.Integer(),
    'enabled': fields.Boolean()
})

page_of_notification_services_model = api.inherit('Page of notification services', pagination, {
    'items': fields.List(fields.Nested(notification_service_model))
})
