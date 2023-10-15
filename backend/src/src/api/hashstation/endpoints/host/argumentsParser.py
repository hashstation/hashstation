'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import inputs, reqparse

from src.api.hashstation.argumentsParser import pagination

jobHost_parser = pagination.copy()
jobHost_parser.add_argument('name', type=str, required=False, help='Filter according to name')

jobHost_parser.add_argument('order_by', type=str, required=False, help='Ordering of the results', choices=['domain_name', 'os_name', 'p_model', 'time', 'status'])
jobHost_parser.add_argument('descending', type=inputs.boolean, required=False)
jobHost_parser.add_argument('showDeleted', type=inputs.boolean, required=False, default=False)
jobHost_parser.add_argument('all', type=inputs.boolean, required=False, default=False)


hostSettings_arguments = reqparse.RequestParser()
hostSettings_arguments.add_argument('workload_profile', type=int, help='', required=False, location='json')
hostSettings_arguments.add_argument('device_types', type=int, help='', required=False, location='json')
hostSettings_arguments.add_argument('extra_hc_args', type=str, help='', required=False, location='json')

