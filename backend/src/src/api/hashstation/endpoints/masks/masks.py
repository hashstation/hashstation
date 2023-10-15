'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging

import os
from flask import request, redirect, send_file
from flask_restx import Resource, abort
from sqlalchemy import exc

from settings import MASKS_DIR, ROOT_DIR
from src.api.apiConfig import api
from src.api.hashstation.attacks.functions import check_mask_syntax
from src.api.hashstation.endpoints.markov.responseModels import hcStatsCollection_model
from src.api.hashstation.endpoints.masks.argumentsParser import updateMask_parser
from src.api.hashstation.endpoints.masks.responseModels import maskSet_model
from src.api.hashstation.functions import fileUpload
from src.api.hashstation.responseModels import simpleResponse
from src.database import db
from src.database.models import HsMasksSet

log = logging.getLogger(__name__)
ns = api.namespace('masks', description='Endpoints for work with mask files.')

ALLOWED_EXTENSIONS = set(['txt', 'hcmask'])


@ns.route('')
class maskCollection(Resource):
    @api.marshal_with(hcStatsCollection_model)
    def get(self):
        """
        Returns collection mask files.
        """
        return {'items': HsMasksSet.query.filter(HsMasksSet.deleted == False).all()}



@ns.route('/add')
class maskAdd(Resource):

    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Uploads mask file on server.
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

        content = file.read().splitlines()
        for line in content:
            check_mask_syntax(line.decode("utf-8"))

        uploadedFile = fileUpload(file,
                                  MASKS_DIR,
                                  ALLOWED_EXTENSIONS,
                                  "".join(x.decode("utf-8") + "\n" for x in content),
                                  suffix='.hcmask', withTimestamp=True)
        if uploadedFile:
            maskSet = HsMasksSet(name=uploadedFile['filename'], path=uploadedFile['path'])
            try:
                db.session.add(maskSet)
                db.session.commit()
            except exc.IntegrityError as e:
                db.session().rollback()
                abort(500, 'Masks set with name ' + uploadedFile['filename'] + ' already exists.')
            return {
                'message': 'File ' + uploadedFile['filename'] + ' successfully uploaded.',
                'status': True
            }
        else:
            abort(500, 'Wrong file format')


@ns.route('/<id>')
class mask(Resource):

    @api.marshal_with(maskSet_model)
    def get(self, id):
        """
        Returns information about maskset with data.
        """

        maskSet = HsMasksSet.query.filter(HsMasksSet.id == id).first()

        with open(os.path.join(MASKS_DIR, maskSet.path)) as file:
            content = file.read()

        return {
            'id': maskSet.id,
            'name': maskSet.name,
            'time': maskSet.time,
            'data': content
        }

    @api.marshal_with(simpleResponse)
    def delete(self, id):
        """
        Deletes mask.
        """
        mask = HsMasksSet.query.filter(HsMasksSet.id == id).one()
        mask.deleted = True
        db.session.commit()
        return {
            'status': True,
            'message': 'Mask file sucesfully deleted.'
        }, 200



@ns.route('/<id>/download')
class downloadMask(Resource):

    def get(self, id):
        """
        Downloads maskset.
        """

        maskSet = HsMasksSet.query.filter(HsMasksSet.id == id).first()
        path = os.path.join(MASKS_DIR, maskSet.path)
        return send_file(path, download_name=maskSet.path, as_attachment=True)
