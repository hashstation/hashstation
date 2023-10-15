'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging.config
import secrets

from flask import Flask, Blueprint, request, url_for
from flask_cors import CORS
from flask_login import login_required, current_user
from flask import abort, make_response, jsonify

import settings
from src.api.apiConfig import api
from src.api.hashstation.endpoints.chart.chart import ns as chart_namespace
from src.api.hashstation.endpoints.hashcat.hashcat import ns as hashcat_namespace
from src.api.hashstation.endpoints.host.hosts import ns as hosts_namespace
from src.api.hashstation.endpoints.notifications.notifications import ns as notifications_namespace
from src.api.hashstation.endpoints.job.job import ns as job_namespace
from src.api.hashstation.endpoints.bins.bins import ns as bins_namespace
from src.api.hashstation.endpoints.batches.batches import ns as batches_namespace
from src.api.hashstation.endpoints.serverInfo.server import ns as server_namespace
from src.api.hashstation.endpoints.user.user import login_manager
from src.api.hashstation.endpoints.user.user import ns as user_namespace
from src.api.hashstation.endpoints.dictionary.dictionary import ns as dictionary_namespace
from src.api.hashstation.endpoints.pcfg.pcfg import ns as pcfg_namespace
from src.api.hashstation.endpoints.markov.markov import ns as markov_namespace
from src.api.hashstation.endpoints.masks.masks import ns as masks_namespace
from src.api.hashstation.endpoints.rule.rule import ns as rule_namespace
from src.api.hashstation.endpoints.charset.charset import ns as charset_namespace
from src.api.hashstation.endpoints.directory.directory import ns as directory_ns
from src.api.hashstation.endpoints.protectedFile.protectedFile import ns as protected_files_ns
from src.api.hashstation.endpoints.hashCache.hashes import ns as hashes_ns
from src.api.hashstation.endpoints.jobTemplate.template import ns as template_ns
from src.api.hashstation.endpoints.logs.logs import ns as logs_ns
from src.api.hashstation.endpoints.status.status import ns as status_ns
from src.api.hashstation.endpoints.pcfg.pcfg import ns as pcfg_ns
from src.api.hashstation.endpoints.settings.settings import ns as settings_ns

from src.api.hashstation.endpoints.notifications.notifier import notify

from src.database import db
from src.database.models import HsUser

from flask_apscheduler import APScheduler

app = Flask(__name__)


def configure_app(flask_app):
    flask_app.config['SECRET_KEY'] = secrets.token_hex(16)
    # flask_app.config['SERVER_NAME'] = settings.FLASK_SERVER_NAME
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = settings.SQLALCHEMY_TRACK_MODIFICATIONS
    flask_app.config['SWAGGER_UI_DOC_EXPANSION'] = settings.RESTX_SWAGGER_UI_DOC_EXPANSION
    flask_app.config['RESTX_VALIDATE'] = settings.RESTX_VALIDATE
    flask_app.config['RESTX_MASK_SWAGGER'] = settings.RESTX_MASK_SWAGGER
    flask_app.config['ERROR_404_HELP'] = settings.RESTX_ERROR_404_HELP
    flask_app.config['SESSION_COOKIE_SAMESITE'] = None
    flask_app.config['SESSION_COOKIE_SECURE'] = True
    # flask_app.config['DEBUG'] = True


def initialize_app(flask_app):
    configure_app(flask_app)

    blueprint = Blueprint('api',  __name__)
    api.init_app(blueprint)
    api.add_namespace(job_namespace)
    api.add_namespace(bins_namespace)
    api.add_namespace(batches_namespace)
    api.add_namespace(chart_namespace)
    api.add_namespace(hosts_namespace)
    api.add_namespace(hashcat_namespace)
    api.add_namespace(server_namespace)
    api.add_namespace(user_namespace)
    api.add_namespace(notifications_namespace)
    api.add_namespace(dictionary_namespace)
    api.add_namespace(pcfg_namespace)
    api.add_namespace(markov_namespace)
    api.add_namespace(masks_namespace)
    api.add_namespace(rule_namespace)
    api.add_namespace(charset_namespace)
    api.add_namespace(protected_files_ns)
    api.add_namespace(directory_ns)
    api.add_namespace(hashes_ns)
    api.add_namespace(template_ns)
    api.add_namespace(logs_ns)
    api.add_namespace(status_ns)
    api.add_namespace(pcfg_ns)
    api.add_namespace(settings_ns)

    flask_app.register_blueprint(blueprint)

    CORS(app, supports_credentials=True)
    return flask_app


@app.before_request
def check_valid_login():
    SKIP_EXACT = {'/', '/swagger.json'}
    SKIP_FROM = ('/swaggerui')
    if request.path in SKIP_EXACT or request.path.startswith(SKIP_FROM) or request.blueprint == 'RESTX_doc':
        return
    if not app.view_functions.get(request.endpoint):
        abort(make_response(jsonify(message=('Endpoint ' + request.url + ' not exists.' )), 400))

    publicEndpoint = getattr(app.view_functions[request.endpoint].view_class, 'is_public', False)
    if not publicEndpoint and request.method != 'OPTIONS':
        login_valid = current_user.is_authenticated
        if not login_valid:
            abort(401)
    return


def main():
    app.run(host='0.0.0.0', port=5000, threaded=False)


initialize_app(app)
login_manager.init_app(app)

db.init_app(app)

def notifier():
    with app.app_context():
        for user in HsUser.query.all():
            notify(user)

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.add_job(id='notifier', func=notifier, trigger='interval', seconds=10)
scheduler.start()

if __name__ == "__main__":
    main()
