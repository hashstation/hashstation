'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging
import json

from flask import request

from flask_restx import Resource
from flask_restx import reqparse

from src.api.apiConfig import api
from src.api.hashstation.endpoints.jobTemplate.responseModels import templates_model, template_data
from src.api.hashstation.responseModels import simpleResponse

from src.database import db
from src.database.models import HsTemplate

log = logging.getLogger(__name__)
ns = api.namespace('template', description='Endpoints for job templates.')

add_model = api.schema_model('add_template', {'properties': {'template': {'type': 'string'}}})

#add_template_args = reqparse.RequestParser()
#add_template_args.add_argument('template', type=str, help='name of the template', required=True, location='json')

@ns.route('')
class template(Resource):

    @api.expect(add_model)
    @api.marshal_with(simpleResponse)
    def put(self):
        """
        Add or edit a job template.
        """

        data = request.json
        template_name = data['template']

        template = HsTemplate.query.filter_by(name=template_name).one_or_none()
        if not template:
            template = HsTemplate(name=template_name, template=data)
            action = 'added'
        else:
            template.template = data
            action = 'changed'

        try:
            db.session.add(template)
            db.session.commit()
        except exc.IntegrityError as e:
            db.session().rollback()
            abort(500, 'Couldn\'t add template.')
        return {
            'status': True,
            'message': 'Template ' + template_name + ' ' + action
        }

    @api.marshal_with(templates_model)
    def get(self):
        """
        Returns collection of job templates.
        """
        return {'items': HsTemplate.query.all()}


@ns.route('/<id>')
class templateData(Resource):

    @api.marshal_with(template_data)
    def get(self, id):
        """
        Returns a template with its job settings.
        """
        template = HsTemplate.query.get(id)
        if template is None:
            abort(404, 'No such template')
        else:
            return {
                'template': json.dumps(template.template) # uhm...
            }

    @api.response(200, 'Deleted')
    @api.response(500, 'Failed')
    def delete(self, id):
        """
        Deletes a template
        """
        try:
            HsTemplate.query.filter_by(id=id).delete()
            db.session.commit()
        except exc.IntegrityError as e:
            db.session().rollback()
            abort(500, 'Couldn\'t delete template.')
        return ('Deleted', 200)
