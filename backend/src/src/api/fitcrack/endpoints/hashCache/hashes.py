'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import base64
import logging
import io
from operator import or_

from flask import request, send_file
from flask_restx import Resource

from src.api.apiConfig import api
from src.api.fitcrack.endpoints.hashCache.argumentsParser import hashes_parser
from src.api.fitcrack.endpoints.hashCache.responseModels import page_of_hashes_model
from src.api.fitcrack.endpoints.host.responseModels import page_of_hosts_model

from src.database.models import FcHash

log = logging.getLogger(__name__)
ns = api.namespace('hashes', description='Operations with hashes.')




@ns.route('')
class hashCache(Resource):

    @api.expect(hashes_parser)
    @api.marshal_with(page_of_hashes_model)
    def get(self):
        """
        Returns list of hashes.
        """

        args = hashes_parser.parse_args(request)
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)

        hashes = FcHash.query


        if args.search:
            print('%' + args.search.encode().hex() + '%')
            hashes = hashes.filter(or_(FcHash.result.like(bytes('%' + args.search.encode().hex() + '%', "ascii")),
                                       FcHash.hash.like(bytes('%' + args.search + '%', "utf-8"))))

        if args.order_by:
            orderBy = getattr(FcHash, args.order_by)
            if args.descending:
                orderBy = orderBy.desc()
                hashes = hashes.order_by(orderBy)

        else:
            hashes = hashes.order_by(FcHash.id.desc())



        return hashes.paginate(page, per_page, error_out=True)

@ns.route('/exportCrackedHashes')
class exportCrackedHashes(Resource):
    def get(self):
        """
        Exports cracked password hashes
        """
        crackedHashes = io.BytesIO()

        hashes = FcHash.query.filter(FcHash.result != None).all()
        crackedHashes.write(b'Hash,Hash type,Password\n')

        for h in hashes:
            crackedHashes.write(h.hashText.encode('utf-8'))
            crackedHashes.write(b',')
            crackedHashes.write(str(h.hash_type).encode('utf-8'))
            crackedHashes.write(b',')
            crackedHashes.write(h.password.encode('utf-8'))
            crackedHashes.write(b'\n')

        crackedHashes.seek(0)
        return send_file(crackedHashes, mimetype="text/csv")
