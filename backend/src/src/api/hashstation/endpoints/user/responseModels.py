'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import fields

from src.api.apiConfig import api

role_model = api.model('User role', {
    'id': fields.Integer(readOnly=True, required=False),
    'name': fields.String(),
    'MANAGE_USERS': fields.Boolean(default=False),
    'ADD_NEW_JOB': fields.Boolean(default=False),
    'UPLOAD_DICTIONARIES': fields.Boolean(default=False),
    'VIEW_ALL_JOBS': fields.Boolean(default=False),
    'EDIT_ALL_JOBS': fields.Boolean(default=False),
    'OPERATE_ALL_JOBS': fields.Boolean(default=False),
    'ADD_USER_PERMISSIONS_TO_JOB': fields.Boolean(default=False)
})

role_list_model = api.model('User role list', {
    'items': fields.List(fields.Nested(role_model))
})

hs_user_model = api.model('User', {
    'id': fields.Integer(readOnly=True, required=False),
    'username': fields.String(readOnly=True, required=False),
    'mail': fields.String(),
    'role': fields.Nested(role_model)
})

login_response = api.model('Login response', {
    'user': fields.Nested(hs_user_model),
    'token': fields.String()
})

user_list_model = api.model('User list', {
    'items': fields.List(fields.Nested(hs_user_model))
})

isLoggedIn_model = api.model('isLoggedIn', {
    'user': fields.Nested(hs_user_model),
    'loggedIn': fields.Boolean(),
    'token': fields.String()
})

userSuccessResponse_model = api.model('200', {
    'message': fields.String(),
    'status': fields.Boolean()
})
