'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import fields

from src.api.apiConfig import api
from src.api.hashstation.endpoints.job.responseModels import workunit_model
from src.api.hashstation.responseModels import pagination, host_short_model, job_short_model, boincHost_model, \
    user_model






hashes_model = api.model('Hashes model', {
    'id': fields.Integer(readOnly=True, required=False),
    'username': fields.String(),
    'hash_type_name': fields.String(),
    'hash': fields.String(attribute='hashText'),
    'password': fields.String(),
    'added': fields.DateTime(),
    'job': fields.Nested(job_short_model)
})


page_of_hashes_model = api.inherit('Page of hashes', pagination, {
    'items': fields.List(fields.Nested(hashes_model))
})
