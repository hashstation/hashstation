'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging

from flask_restx import Resource

from src.api.apiConfig import api
from src.api.hashstation.endpoints.status.responseModels import JobStatusCollection_model
from src.database.models import HsJobStatus

log = logging.getLogger(__name__)
ns = api.namespace('status', description='Endpoints for reading changes in job status.')


@ns.route('')
class statusCollection(Resource):

    @api.marshal_with(JobStatusCollection_model)
    def get(self):
        """
        Returns collection of all job statuses.
        """
        return {'items': HsJobStatus.query.all()}


@ns.route('/<id>')
class statusCollection(Resource):

    @api.marshal_with(JobStatusCollection_model)
    def get(self, id):
        """
        Returns collection of all job statuses.
        """
        return {'items': HsJobStatus.query.filter(HsJobStatus.job_id == id).all()}
