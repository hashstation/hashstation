'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import fields

from src.api.apiConfig import api
from src.api.hashstation.endpoints.job.responseModels import workunit_model
from src.api.hashstation.responseModels import pagination, host_short_model, job_short_model, boincHost_model, \
    user_model, device_model

page_of_hosts_model = api.inherit('Page of hosts', pagination, {
    'items': fields.List(fields.Nested(boincHost_model))
})

boincHostDetail_model = api.model('Host detail boinc', {
    'id': fields.Integer(readOnly=True, required=False),
    'domain_name': fields.String(),
    'p_model': fields.String(),
    'user': fields.Nested(user_model),
    'os_name': fields.String(),
    'hs_host': fields.Nested(host_short_model),
    'active': fields.Boolean(),
    'jobs': fields.List(fields.Nested(job_short_model)),
    'devices': fields.List(fields.Nested(device_model))
})

boincHostBenchmark_model = api.model('Boinc host benchmarks', {
    'hash_type': fields.Integer(),
    'attack_mode': fields.Integer(),
    'power': fields.Integer()
})

boincHostBenchmarks_model = api.inherit('Benchmarks for Boinc hosts', {
    'items': fields.List(fields.Nested(boincHostBenchmark_model))
})

hostSettings_model = api.model('Host settings', {
    'device_types': fields.Integer(),
    'workload_profile': fields.Integer(),
    'extra_hc_args': fields.String(),
})