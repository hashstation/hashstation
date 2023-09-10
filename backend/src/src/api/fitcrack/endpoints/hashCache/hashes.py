'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import base64
import logging
import io
import csv
import datetime
from operator import or_

from flask import request, redirect, send_file
from flask_restx import Resource
from flask_restx import abort
from src.api.apiConfig import api
from src.api.fitcrack.endpoints.hashCache.argumentsParser import hashes_parser, hashList_argument
from src.api.fitcrack.endpoints.hashCache.responseModels import page_of_hashes_model
from src.api.fitcrack.endpoints.host.responseModels import page_of_hosts_model

from src.api.fitcrack.responseModels import simpleResponse

from src.database.models import FcHash
from src.database import db

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

        hashes = FcHash.query.filter_by(deleted=False)


        if args.search:
            print('%' + args.search.encode().hex() + '%')
            hashes = hashes.filter(or_(FcHash.result.like(bytes('%' + args.search.encode().hex() + '%', "ascii")),
                                       FcHash.hash.like(bytes('%' + args.search + '%', "utf-8"))))

        if args.order_by:
            # Remap some hybrid properties to existing DB columns
            if args.order_by == "password":
                args.order_by = "result"

            if args.order_by == "hash_type_name":
                args.order_by = "hash_type"

            orderBy = getattr(FcHash, args.order_by)
            if args.descending:
                orderBy = orderBy.desc()
                hashes = hashes.order_by(orderBy)

        else:
            hashes = hashes.order_by(FcHash.id.desc())

        return hashes.paginate(page=page, per_page=per_page, error_out=True)
    
    @api.expect(hashList_argument)
    @api.response(200, 'Hashes successfully deleted.')
    @api.response(500, 'Failed to delete selected hashes.')
    def patch(self):
        """
        Delete selected hashes.
        """

        args = hashList_argument.parse_args(request)
        ids = args['hash_ids']
        query = FcHash.query.filter(FcHash.id.in_(ids))

        hashes = query.all()
        if not hashes:
            abort(400, 'No hashes selected.')

        for h in hashes:
            h.deleted = not h.deleted

        try:
            db.session.commit()
        except:
            return 'Oops', 500

        return 'Moved', 200

@ns.route('/exportCrackedHashes')
class exportCrackedHashes(Resource):
    def get(self):
        """
        Exports cracked password hashes
        """
        crackedHashes = io.BytesIO()

        hashes = FcHash.query.filter_by(deleted=False)

        hashes = hashes.filter(FcHash.result != None).all()

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


@ns.route('/importCrackedHashes')
class importCrackedHashes(Resource):

    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Uploads pre-cracked hashes on the server.
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

        if not file.filename.endswith('.csv'):
            abort(400, 'File is not a CSV')
            return redirect(request.url)

        # Read the content and wrap it in a StringIO object
        file.seek(0)
        file_content = file.read().decode('utf-8')
        file_stream = io.StringIO(file_content)
        csv_reader = csv.DictReader(file_stream)
        headers = csv_reader.fieldnames

        # Check for mandatory headers
        mandatory_headers = {"Hash", "Hash type", "Password"}
        if not mandatory_headers.issubset(set(headers)):
            abort(400, 'CSV does not have the mandatory headers')
            return redirect(request.url)
        
        # Iterate over rows in the CSV
        for row in csv_reader:
            hash_type = row["Hash type"]
            hash_value = row["Hash"]
            password = row["Password"]
            hash_bytes = hash_value.encode('utf-8')
            result = password.encode('utf-8').hex()
            new_hash = FcHash(hash_type=hash_type, hash=hash_bytes, result=result, time_cracked=datetime.datetime.utcnow())
            db.session.add(new_hash)

        db.session.commit()

        try:
            # db.session.commit()
            pass
        except:
            abort(400, 'Unable to process uploaded CSV with hashes.')
            return redirect(request.url)

        return {
            'message': 'Cracked hashes successfully uploaded.',
            'status': True
        }