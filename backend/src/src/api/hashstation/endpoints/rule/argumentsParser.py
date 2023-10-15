'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import reqparse

from src.api.hashstation.argumentsParser import pagination

updateRule_parser = reqparse.RequestParser()
updateRule_parser.add_argument('newRule', type=str, required=True)


rule_parser = pagination.copy()
rule_parser.add_argument('search', type=str, required=False)