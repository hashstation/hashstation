'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import os
from flask_restx import abort

from settings import FILE2HASHCAT_PATH, FILE2HASHCAT_SCRIPT, PROTECTEDFILES_DIR
from src.api.hashstation.functions import shellExec


def getHashFromFile(filename, path):
    res = shellExec('python3 ' + FILE2HASHCAT_SCRIPT + ' -t ' + os.path.join(PROTECTEDFILES_DIR, path), cwd=FILE2HASHCAT_PATH, getReturnCode=True)
    if res['returnCode'] == 2:
        abort(500, 'Hashcat doesn\'t support PKZIP.')
    if res['returnCode'] != 0:
        abort(500, 'Could not extract hash from file.')
    res = res['msg'].split('\n')
    return {
        'hash': res[0],
        'hash_type': res[1]
    }
