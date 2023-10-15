'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

import os
import subprocess
import time
from pathlib import Path

import sys
import os
import datetime
from flask_restx import abort
from sqlalchemy import exc
from werkzeug.utils import secure_filename

from src.database import db

"""Functions which are used in multiple files"""


def shell_exec(args, cwd=None):
    """
    Execute the external command
    """

    try:
        print(' '.join(args), file=sys.stderr)
        process = subprocess.Popen(args, shell=False,
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE,
                                   cwd=cwd)

        # wait for the process to terminate
        output, _ = process.communicate()
        return_code = process.returncode
    except subprocess.CalledProcessError as err:
        print(err, file=sys.stderr)
        return None, return_code
    else:
        output = output.decode('utf-8', errors='ignore')
        return output, return_code


# shellExec is not very secure with user supplied input, use 'shell_exec'.
def shellExec(cmd, abortOnError=True, cwd=None, getOnlyReturnCode=False, getReturnCode=False):
    """
    Execute the external command
    """

    try:
        print(cmd, file=sys.stderr)
        process = subprocess.Popen(cmd, shell=True,
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE,
                                   cwd=cwd)

        # wait for the process to terminate
        out, err = process.communicate()
        rtnCode = process.returncode
    except subprocess.CalledProcessError as err:
        print('SHELL ERROR:', err, file=sys.stderr)
        if abortOnError:
            abort(400, 'Error with shell execution ' + err.decode('utf-8'))
        return rtnCode
    else:
        out = out.decode('utf-8', errors='ignore')
        if getOnlyReturnCode:
            return rtnCode
        elif getReturnCode:
            return {
                'returnCode': rtnCode,
                'msg': out
            }
        else:
            return out


def getStringBetween(string, substring1, substring2):
    """
    Gets string between two strings
    """

    start = string.find(substring1)
    if start == -1:
        abort(500,'server error')
    start += len(substring1)
    end = string.find(substring2, start)
    return string[start:end]


def parserAsciiTable(table):
    table = table.splitlines()

    header = table[0].split('|')
    for i,columnName in enumerate(header):
        header[i] = columnName.strip()

    result = []
    for i,line in enumerate(table[2:]):
        tmpLine = line.split('|')
        row = {}
        for j,columnData in enumerate(tmpLine):
            row[header[j]] = columnData.strip()

        result.append(row)
    return result


def lenStr(o):
    """
    !!!STRING!!! that contains length of object
    """
    return str(len(o))


def allowed_file(filename, extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensions


def fileUpload(file, dir, extensions, content=None, suffix=None, withTimestamp=False):
    if file.filename == '':
        abort(500, 'No selected file')
    if allowed_file(file.filename, extensions):

        filename = secure_filename(file.filename)
        originalFilename = file.filename
        originalSuffix = Path(filename).suffix
        stem = Path(filename).stem

        if withTimestamp:
            filename = stem + '_' + str(int(time.time())) + originalSuffix

        if suffix:
            filename = stem + suffix

        path = os.path.join(dir, filename)

        if os.path.exists(path):
            abort(500, 'File with name ' + filename + ' was used before. Choose a different name.')

        file.save(path)
        file.close()

        if content:
            file = open(path, "w")
            file.write(content)
            file.close()

        return {
            'stem': stem,
            'suffix': suffix if suffix else originalSuffix,
            'filename': secure_filename(originalFilename),
            'path': filename
        }
    else:
        error = 'Can\'t upload file %s. This file extension is not allowed.' % (file.filename)
        abort(500, error)
    return None


def getFilesFromFolder(folder, DBmodel, processFunction):
    if not os.path.exists(folder):
        abort(500, 'Directory ' + folder + ' does not exist.')

    result = []
    for file in os.listdir(folder):
        if file.startswith('.'):
            continue
        filePath = os.path.join(folder, file)
        if os.path.isfile(filePath):
            modificationTime = datetime.datetime.fromtimestamp(os.path.getmtime(filePath)).strftime('%Y-%m-%d %H:%M:%S')
            DBrecord = DBmodel.query.filter_by(path=file).first()
            if not DBrecord:
                DBrecord = DBmodel(time=modificationTime, path=file, name=file)
                DBrecord = processFunction(DBrecord)
                try:
                    db.session.add(DBrecord)
                    db.session.commit()
                except exc.IntegrityError as e:
                    db.session().rollback()
                    abort(500, 'Can\'t create record in DB with  ' + file + '.')
            if not DBrecord.deleted:
                result.append(DBrecord)
    return result

def get_nesting (path, root = '/'):
    localpath = path.replace(root, '').split('/')
    return localpath[1:], localpath[-1]

def directory_tree (path):
    parent = os.path.dirname(path) + '/'
    _, name = get_nesting(path, parent)
    listing = {
        'name': name,
        'children': []
    }
    # walk recursively
    for base, dirs, files in os.walk(path):
        nest_in, name = get_nesting(base, parent)
        # go to current root in dict
        root = listing
        for d in nest_in:
            for child in root['children']:
                if child['name'] == d:
                    root = child
        # insert contents
        for d in sorted(dirs):
            root['children'].append({
                'name': d,
                'empty': True,
                'children': [],
                'path': os.path.join(*nest_in, d)
            })
        for f in sorted(files):
            root['empty'] = False
            root['children'].append({
                'name': f,
                'path': os.path.join(*nest_in, f)
            })
    
    return listing

def sorted_cp (src, dst):
    "Sort source text file by line length and output to destination"
    lengths = []
    with open(src, 'r', encoding="ascii", errors="surrogateescape") as i, open(dst, 'w', encoding="ascii", errors="surrogateescape") as o:
        while True:
            off = i.tell()
            l = i.readline()
            if not l: break
            lengths.append(( off, len(l), len(l.rstrip()) ))
        lengths = sorted(lengths, key=lambda x:x[2])
        for off, ln, _ in lengths:
            i.seek(off)
            line = i.read(ln)
            if not line.endswith('\n'):
                line += '\n'
            o.write(line)

def get_batch_status (total, remaining, any_running):
    if total == remaining:
        return {
            'code': 0,
            'text': 'Prepared',
            'icon': 'mdi-filter-variant',
            'color': 'info',
            'description': 'The batch is ready to run.'
        }
    elif any_running:
        return {
            'code': 1,
            'text': 'Working',
            'icon': 'mdi-altimeter',
            'color': 'warning',
            'description': 'The batch is running its jobs in sequence.'
        }
    elif remaining == 0:
        return {
            'code': 3,
            'text': 'Done',
            'icon': 'mdi-check-all',
            'color': 'success',
            'description': 'All jobs are done running.'
        }
    else:
        return {
            'code': 2,
            'text': 'Interrupted',
            'icon': 'mdi-hand-right',
            'color': 'error',
            'description': 'The batch is stopped and ready to resume.'
        }
