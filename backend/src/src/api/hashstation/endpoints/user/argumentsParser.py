'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import reqparse

user_login_arguments = reqparse.RequestParser()
user_login_arguments.add_argument('username', type=str, help='username', required=True, location='json')
user_login_arguments.add_argument('password', type=str, help='password', required=True, location='json')

user_change_password_arguments = reqparse.RequestParser()
user_change_password_arguments.add_argument('old_password', type=str, help='old password', required=True)
user_change_password_arguments.add_argument('new_password', type=str, help='new password', required=True)


change_user_role_arguments = reqparse.RequestParser()
change_user_role_arguments.add_argument('user_id', type=int, help='user id', required=True, location='json')
change_user_role_arguments.add_argument('role_id', type=int, help='role id', required=True, location='json')

change_role_arguments = reqparse.RequestParser()
change_role_arguments.add_argument('key', type=str, help='name of the permission', required=True, location='json')
change_role_arguments.add_argument('value', type=bool, help='true/false', required=True, location='json')

new_role_arguments = reqparse.RequestParser()
new_role_arguments.add_argument('name', type=str, help='name of new role', required=True, location='json')

new_user_arguments = reqparse.RequestParser()
new_user_arguments.add_argument('mail', type=str, help='email', required=True, location='json')
new_user_arguments.add_argument('username', type=str, help='username', required=True, location='json')
new_user_arguments.add_argument('password', type=str, help='password', required=True, location='json')
new_user_arguments.add_argument('role_id', type=int, help='id role', required=True, location='json')

edit_user_arguments = reqparse.RequestParser()
edit_user_arguments.add_argument('mail', type=str, help='email', required=False, location='json')
edit_user_arguments.add_argument('username', type=str, help='username', required=False, location='json')
edit_user_arguments.add_argument('password', type=str, help='new password', required=False, location='json')