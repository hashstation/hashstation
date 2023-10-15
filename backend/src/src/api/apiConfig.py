'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging
import traceback

from flask_restx import Api
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import ProgrammingError

import settings

log = logging.getLogger(__name__)


# API Docs Header
api = Api(version='1.0', title='Hashstation API',
          description='')



# ERROR HANDLERS

@api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred.'
    log.exception(message)

    #if not settings.FLASK_DEBUG:
    return {'message': message}, 500


@api.errorhandler(NoResultFound)
def database_not_found_error_handler(e):
    log.warning(traceback.format_exc())
    return {'message': 'A database result was required but none was found.'}, 404


@api.errorhandler(ProgrammingError)
def wrong_database_scheme_error_handler(e):
    log.warning(traceback.format_exc())
    return {'message': e.args[0]}, 404
