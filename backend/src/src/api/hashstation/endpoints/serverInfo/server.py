'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging
from time import sleep
import datetime

from flask_restx import Resource
from src.api.apiConfig import api
from src.api.hashstation.responseModels import simpleResponse
from src.api.hashstation.endpoints.serverInfo.responseModels import serverinfo, usageinfoList, usageinfo, dependency_report
from src.api.hashstation.endpoints.serverInfo.functions import getCpuMemData
from src.api.hashstation.endpoints.serverInfo.transfer import pack, unpack, dependency_check, ImportDependencyMissing
from src.api.hashstation.endpoints.serverInfo.argumentsParser import operation, serverUsage_argument, export_options, dependency_list, job_graph_arguments, delete_usage_data
from src.database import db
from src.database.models import HsServerUsage
from settings import PROJECT_DIR, PROJECT_USER, PROJECT_NAME, BOINC_SERVER_URI
import platform
from flask import request, Response, stream_with_context
from flask_restx import abort
import xml.etree.ElementTree as ET
import urllib.request


log = logging.getLogger(__name__)
ns = api.namespace('serverInfo', description='Operation with server.')


@ns.route('/info')
class serverInfo(Resource):

    @api.marshal_with(serverinfo)
    def get(self):
        """
        Information about server.
        """

        url = BOINC_SERVER_URI + '/' + PROJECT_NAME + '/server_status.php?xml=1'
        request = urllib.request.Request(url)

        try:
            response = urllib.request.urlopen(request)
        except:
            abort(500, 'Can not load ' + url)

        xml = response.read().decode("utf8")
        tree = ET.ElementTree(ET.fromstring(xml)).getroot().find('daemon_status')

        result = []
        for deamon in tree:
            result.append({
                'name': deamon.find('command').text,
                'status': deamon.find('status').text
            })

        return {'subsystems': result}


@ns.route('/getUsageData')
class serverUtil(Resource):

    @api.expect(job_graph_arguments)
    @api.marshal_with(usageinfoList)
    def get(self):
        """
        Returns data from table hs_server_usage according to a given time
        """

        args = job_graph_arguments.parse_args(request)
        fromDate = args['from_date']
        toDate = args['to_date']

        return getCpuMemData(fromDate, toDate)


@ns.route('/actualUsageData')
class actualUsageData(Resource):

    @api.marshal_with(usageinfo)
    def get(self):
        """
        Returns last record from table hs_server_usage
        """

        return HsServerUsage.query.order_by(HsServerUsage.time.desc()).limit(1).one_or_none()

@ns.route('/usageData')
class usageData(Resource):
    # public endpoint, no auth needed, used by measureUsage deamon
    is_public = True

    @api.expect(serverUsage_argument)
    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Function for saving of new data into the table hs_server_usage
        """
        args = serverUsage_argument.parse_args(request)

        serverUsage = HsServerUsage(cpu=args['cpu'], ram=args['ram'], net_recv=args['net_recv'],
                                    net_sent=args['net_sent'], hdd_read=args['hdd_read'], hdd_write=args['hdd_write'])
        try:
            db.session.add(serverUsage)
            db.session.commit()
        except:
            db.session().rollback()
            abort(500, 'An error occurred while saving new statistics data')

        return {
            'message': 'Usage data saved',
            'status': True
        }

    @api.expect(delete_usage_data)
    @api.marshal_with(simpleResponse)
    def delete(self):
        args = delete_usage_data.parse_args(request)
        days = args['days']

        limit = datetime.datetime.utcnow() - datetime.timedelta(days=days)
        HsServerUsage.query.filter(HsServerUsage.time < limit).delete()
        db.session.commit()

        return {
            'message': 'Usage data deleted.',
            'status': True
        }


@ns.route('/transfer')
class systemTransfer(Resource):

    @api.expect(export_options)
    def get(self):
        """
        Configurable system data export to a package file
        """
        args = export_options.parse_args(request)
        jobs = args.get('jobs')

        return Response(stream_with_context(pack(jobs=jobs)))

    @api.marshal_with(simpleResponse)
    def post(self):
        """
        System data import from a package file
        """
        # check if the post request has the file part
        if 'file' not in request.files:
            abort(500, 'No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            abort(500, 'No selected file')
        try:
            unpack(file)
        except ImportDependencyMissing as dep_err:
            return {
                'message': 'Missing dependencies: {}'.format(", ".join(dep_err.missing)),
                'status': False
            }

        return {
            'message': 'Package data imported',
            'status': True
        }


@ns.route('/transfer/validate')
class systemTransfer(Resource):

    @api.expect(dependency_list)
    @api.marshal_with(dependency_report)
    def post(self):
        """
        Pre-import dependency check
        """
        args = dependency_list.parse_args(request)
        deps = args.get('deps')
        _, missing = dependency_check(deps)
        return {
            'missing': missing
        }
