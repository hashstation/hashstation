'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from flask_restx import reqparse

updateMask_parser = reqparse.RequestParser()
updateMask_parser.add_argument('newMaskSet', type=str, required=True)
