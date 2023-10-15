'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import logging
from itertools import islice

import os

import time
from pathlib import Path
from shutil import move

from flask import request, redirect, send_file
from flask_restx import Resource, abort
from sqlalchemy import exc

from settings import DICTIONARY_DIR, HASHCAT_PATH, HASHCAT_DIR, PWD_DIST_PATH
from src.api.apiConfig import api
from src.api.hashstation.endpoints.dictionary.argumentsParser import dictionary_parser, dictionaryFromFile_parser
from src.api.hashstation.endpoints.dictionary.functions import readingFromFolderPostProcces
from src.api.hashstation.endpoints.dictionary.responseModels import dictionaries_model, dictData_model, \
    dictionary_model
from src.api.hashstation.functions import shell_exec, fileUpload, allowed_file, getFilesFromFolder, sorted_cp
from src.api.hashstation.responseModels import simpleResponse
from src.database import db
from src.database.models import HsDictionary

log = logging.getLogger(__name__)
ns = api.namespace('dictionary', description='Endpoints for work with charset dictionary.')


ALLOWED_EXTENSIONS = set(['txt'])


@ns.route('')
class dictionaryCollection(Resource):

    @api.marshal_with(dictionaries_model)
    def get(self):
        """
        Returns collection of dictionaries.
        """
        #dictionaries = getFilesFromFolder(DICTIONARY_DIR, HsDictionary, readingFromFolderPostProcces)
        dictionaries = HsDictionary.query.filter_by(deleted=False).all()
        return {'items': dictionaries}

@ns.route('/<id>')
class dictionary(Resource):

    @api.marshal_with(dictionary_model)
    def get(self, id):
        """
        Returns information about dictionary.
        """

        dict = HsDictionary.query.filter(HsDictionary.id==id).first()
        if not dict:
            abort(500, 'Can\'t open dictionary')

        return dict


    @api.marshal_with(simpleResponse)
    def delete(self, id):
        """
        Deletes dictionary.
        """
        dictionary = HsDictionary.query.filter(HsDictionary.id == id).one()
        dictFullPath = os.path.join(DICTIONARY_DIR, dictionary.path)
        if os.path.exists(dictFullPath):
            os.remove(dictFullPath)
            dictionary.deleted = True
            db.session.commit()
        return {
            'status': True,
            'message': 'Dictionary sucesfully deleted.'
        }, 200

@ns.route('/<id>/download')
class dictionaryDownload(Resource):
    def get(self, id):
        """
        Sends dictionary as attachment
        """

        dictionary = HsDictionary.query.filter(HsDictionary.id == id).one()
        if not dictionary:
            abort(500, 'Can\'t find dictionary')
        path = os.path.join(DICTIONARY_DIR, dictionary.path)
        return send_file(path, download_name=dictionary.path, as_attachment=True)

@ns.route('/<id>/data')
class dictionaryData(Resource):

    @api.expect(dictionary_parser)
    @api.marshal_with(dictData_model)
    def get(self, id):
        """
        Returns first 25 rows from dictionary.
        """
        args = dictionary_parser.parse_args(request)
        page = args.get('page', 1) - 1
        per_page = args.get('per_page', 25)
        dict = HsDictionary.query.filter(HsDictionary.id==id).first()
        if not dict:
            abort(500, 'Can\'t open dictionary')
        dict_path = os.path.join(DICTIONARY_DIR, dict.path)
        if not os.path.exists(dict_path):
            return {
                'status': False,
                'data': ''
            }

        if args.get('search', None):
            with open(dict_path,  encoding='latin-1') as file:
                head = ''
                for line in file:
                    if line.find(args['search']) != -1:
                        head += line
        else:
            with open(dict_path, encoding='latin-1') as file:
                head = list(islice(file, page * per_page, page * per_page + per_page))

        if len(head) == 0:
            return {
                'status': False,
                'data': ''
            }
        else:
            return {
                'status': True,
                'data': ''.join(head)
            }


@ns.route('/add')
class dictionaryAdd(Resource):

    @api.marshal_with(simpleResponse)
    def post(self):
        """
        Uploads dictionary on the server.
        """
        # check if the post request has the file part
        if 'file' not in request.files:
            abort(500, 'No file part')
            return redirect(request.url)
        file = request.files['file']
        hex_dict = request.form.get('hex_dict') == 'true'
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            abort(500, 'No selected file')

        uploadedFile = fileUpload(file, DICTIONARY_DIR, ALLOWED_EXTENSIONS)
        if uploadedFile:
            dict_path = os.path.join(DICTIONARY_DIR, uploadedFile['path'])
            if request.form.get('sort') == 'true':
                try:
                    sorted_cp(dict_path, dict_path + '_sorted')
                    os.remove(dict_path)
                    move(dict_path + '_sorted', dict_path)
                except:
                    if os.path.isfile(dict_path):
                        os.remove(dict_path)
                    if os.path.isfile(dict_path + '_sorted'):
                        os.remove(dict_path +  '_sorted')
                    abort(500, 'Unable to sort dictionary.')

            pwd_dist, ret_code = shell_exec([PWD_DIST_PATH, dict_path])
            if ret_code != 0:
                if os.path.isfile(dict_path):
                    os.remove(dict_path)
                abort(500, 'Unable to compute password distribution for ' + dict_path)

            hc_keyspace = 0
            for len_dist in pwd_dist.split(';'):
                # password len : number of occurrences
                password_occurrences = len_dist.split(':')
                if len(password_occurrences) == 2:
                    hc_keyspace += int(password_occurrences[1])

            dictionary = HsDictionary(name=uploadedFile['filename'], path=uploadedFile['path'], password_distribution=pwd_dist, keyspace=hc_keyspace, hex_dict=hex_dict)
            try:
                db.session.add(dictionary)
                db.session.commit()
            except exc.IntegrityError as e:
                db.session().rollback()
                abort(500, 'Dictionary with name ' + uploadedFile['filename'] + ' already exists.')
            return {
                'message': 'Dictionary ' + uploadedFile['filename'] + ' successfully uploaded.',
                'status': True

            }
        else:
            abort(500, 'Wrong file format')




@ns.route('/fromFile')
class dictionary(Resource):

    @api.marshal_with(simpleResponse)
    @api.expect(dictionaryFromFile_parser)
    def post(self):
        """
        Makes dictionary from file.
        """

        args = dictionaryFromFile_parser.parse_args(request)
        sort = args.get('sort')
        hex_dict = args.get('hex_dict')
        files = args.get('files')

        for file in files:
            file_path = file['path']
            real_path = os.path.realpath(file_path)

            if not allowed_file(file['name'], ALLOWED_EXTENSIONS):
                abort(500, 'Wrong file format ' + file['name'])
            newName = Path(file['name']).stem + '_' + str(int(time.time())) + Path(file['name']).suffix
            newPath = os.path.join(DICTIONARY_DIR, newName)
            if sort:
                sorted_cp(file_path, newPath)
            else:
                os.symlink(file_path, newPath)
            pwd_dist, ret_code = shell_exec([PWD_DIST_PATH, newPath])
            if ret_code != 0:
                abort(500, 'Unable to compute password distribution for ' + file_path)

            hc_keyspace = 0
            for len_dist in pwd_dist.split(';'):
                # password len : number of occurrences
                password_occurrences = len_dist.split(':')
                if len(password_occurrences) == 2:
                    hc_keyspace += int(password_occurrences[1])

            dictionary = HsDictionary(name=file['name'], path=newName, password_distribution=pwd_dist, keyspace=hc_keyspace, hex_dict=hex_dict)
            try:
                db.session.add(dictionary)
                db.session.commit()
            except exc.IntegrityError as e:
                db.session().rollback()
                abort(500, 'Dictionary with name ' + file['filename'] + ' already exists.')

        return {
            'message': 'Dictionaries successfully uploaded.',
            'status': True
        }
