'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from src.api.hashstation.argumentsParser import pagination
from flask_restx import reqparse

dictionary_parser = pagination.copy()
dictionary_parser.add_argument('search', type=str, required=False)

dictionaryFromFile_parser = reqparse.RequestParser()
dictionaryFromFile_parser.add_argument('files', type=list, required=True, location='json')
dictionaryFromFile_parser.add_argument('sort', type=bool, location='json')
dictionaryFromFile_parser.add_argument('hex_dict', type=bool, location='json')
