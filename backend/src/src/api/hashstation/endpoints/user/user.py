'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging
import jwt
import settings
import sys

from flask import request, current_app
from flask_login import login_user, logout_user, current_user, LoginManager
from flask_restx import Resource, abort
from sqlalchemy import exc
from datetime import datetime, timedelta

from src.api.apiConfig import api
from src.api.hashstation.endpoints.user.argumentsParser import user_login_arguments, change_user_role_arguments, \
    change_role_arguments, new_role_arguments, new_user_arguments, user_change_password_arguments, edit_user_arguments
from src.api.hashstation.endpoints.user.responseModels import hs_user_model, login_response, isLoggedIn_model, role_list_model, \
    user_list_model, userSuccessResponse_model
from src.api.hashstation.responseModels import simpleResponse
from src.database import db
from src.database.models import HsUser, HsSettings, HsRole, AnonUser

log = logging.getLogger(__name__)
ns = api.namespace('user', description='Endpoints for authorization.')

login_manager = LoginManager()
login_manager.anonymous_user = AnonUser

@login_manager.user_loader
def load_user(user_id):
    return HsUser.query.get(int(user_id))

@login_manager.request_loader
def load_user_from_request(request):
    allowed = settings.ALLOW_TOKEN_SIGNIN
    if not allowed:
        return None
    auth_headers = request.headers.get('Authorization', '').split()
    if len(auth_headers) != 2:
        print('No Authorization header found', file=sys.stderr)
        return None
    try:
        token = auth_headers[1]
        data = jwt.decode(token, current_app.config['SECRET_KEY'], leeway=10, algorithms=["HS256"])
        user = HsUser.query.filter_by(mail=data['sub']).one()
        if user:
            return user
    except jwt.ExpiredSignatureError:
        print('JWT is expired', file=sys.stderr)
        return None
    except (jwt.InvalidTokenError, Exception) as e:
        print('Invalid JWT error:', e, file=sys.stderr)
        return None
    return None


@ns.route('/')
class userCollection(Resource):

    @api.marshal_with(user_list_model)
    def get(self):
        """
        Returns list of users.
        """
        users = HsUser.query.filter_by(deleted=False).all()
        return {'items': users}

    @api.expect(new_user_arguments)
    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Adds new user.
        """
        args = new_user_arguments.parse_args(request)
        user = HsUser(mail=args['mail'], username=args['username'], role_id=args['role_id'])
        user.set_password(password=args['password'])
        db.session.add(user)
        db.session.commit()

        settings = HsSettings(user_id=user.id)
        db.session.add(settings)
        db.session.commit()
        return {
            'status': True,
            'message': 'User created.'
        }


@ns.route('/<int:id>')
class user(Resource):

    @api.expect(edit_user_arguments)
    @api.marshal_with(simpleResponse)
    def patch(self, id):
        """
        Edits user.
        """
        args = edit_user_arguments.parse_args(request)
        
        username = args.get('username', None)
        mail = args.get('mail', None)
        password = args.get('password', None)

        user = HsUser.query.filter_by(id=id).one()
        if username:
            user.username = username
        if mail:
            user.mail = mail
        if password:
            user.set_password(password)

        db.session.commit()
        return {
            'status': True,
            'message': 'User updated.'
        }

    @api.marshal_with(simpleResponse)
    def delete(self, id):
        """
        Deletes user.
        """
        user = HsUser.query.filter_by(id=id).one()
        user.deleted = True
        db.session.commit()
        return {
            'status': True,
            'message': 'User deleted.'
        }


@ns.route('/role')
class roleCollection(Resource):

    @api.marshal_with(role_list_model)
    def get(self):
        """
        Returns list of roles.
        """
        roles = HsRole.query.all()
        return {'items': roles}

    @api.expect(change_user_role_arguments)
    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Changes user's role.
        """
        args = change_user_role_arguments.parse_args(request)
        user = HsUser.query.filter_by(id=args['user_id']).one()
        user.role_id = args['role_id']
        db.session.commit()
        return {
            'status': True,
            'message': 'User role updated.'
        }


@ns.route('/role/<int:id>')
class role(Resource):

    @api.expect(change_role_arguments)
    @api.marshal_with(simpleResponse)
    def post(self, id):
        """
        Changes one property in user's role.
        """
        if not current_user.role.MANAGE_USERS:
            abort(401, 'Unauthorized to change roles')
        args = change_role_arguments.parse_args(request)
        role = HsRole.query.filter_by(id=id).one()
        if not hasattr(role, args['key']):
            abort(400, 'Unknown permission ' + args['key'])
        setattr(role, args['key'], args['value'])
        db.session.commit()
        return {
            'status': True,
            'message': 'Role updated.'
        }

    @api.marshal_with(simpleResponse)
    def delete(self, id):
        """
        Deletes role.
        """
        if not current_user.role.MANAGE_USERS:
            abort(401, 'Unauthorized to change roles')
        role = HsRole.query.filter_by(id=id).one()
        try:
            db.session.delete(role)
            db.session.commit()
        except exc.IntegrityError as e:
            db.session().rollback()
            abort(400, 'Role is in use.')

        return {
            'status': True,
            'message': 'Role deleted.'
        }


@ns.route('/role/new')
class roleNew(Resource):

    @api.expect(new_role_arguments)
    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Adds new role into DB.
        """
        if not current_user.role.MANAGE_USERS:
            abort(401, 'Unauthorized to change roles')
        args = new_role_arguments.parse_args(request)
        role = HsRole(name=args['name'])
        db.session.add(role)
        db.session.commit()
        return {
            'status': True,
            'message': 'Role added.'
        }

@api.marshal_with(simpleResponse)
@ns.route('/password/change_my_password')
class change_my_password(Resource):

    #@api.expect(user_change_password_arguments)
    #@api.marshal_with(hs_user_model)
    @api.marshal_with(userSuccessResponse_model)
    def post(self):
        """
        Changes user's password.
        """
        args = user_change_password_arguments.parse_args(request)
        if not (current_user.check_password(args['old_password'])):
            abort(400, 'Incorrect old password')

        else:
            current_user.set_password(args['new_password'])
            db.session.commit()

        return {
            'status': True,
            'message': 'Password changed.'
        }

def issue_token (user):
    return jwt.encode({
                'sub': user.mail,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }, current_app.config['SECRET_KEY'])

@ns.route('/login')
class login(Resource):
    is_public = True

    @api.expect(user_login_arguments)
    @api.marshal_with(login_response)
    def post(self):
        """
        User login.
        """
        args = user_login_arguments.parse_args(request)
        user = HsUser.query.filter_by(username=args['username'], deleted=False).first()
        if not user:
            abort(400, 'User not found')
        if not user.check_password(args['password']):
            abort(400, 'Invalid credentials')

        login_user(user, remember=True)

        allowed = settings.ALLOW_TOKEN_SIGNIN
        if not allowed:
            token = ''
        else:
            token = issue_token(user)

        return {
            'user': user,
            'token': token
        }


@ns.route('/logout')
class logout(Resource):

    def get(self):
        """
        User logout.
        """
        logout_user()
        return 'You are now logged out!'


@ns.route('/isLoggedIn')
class isLoggedIn(Resource):
    is_public = True

    @api.marshal_with(isLoggedIn_model)
    def get(self):
        """
        Finds out if user is logged in and returns him.
        """
        if current_user.is_authenticated:
            allowed = settings.ALLOW_TOKEN_SIGNIN
            if not allowed:
                token = ''
            else:
                token = issue_token(current_user)
            return {
                'user': current_user,
                'loggedIn': True,
                'token': token
            }
        else:
            return {
                'user': None,
                'loggedIn': False,
                'token': ''
            }
