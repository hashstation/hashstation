import platform, time
import msgpack

from flask_login import current_user
from src.database import db
from sqlalchemy import exc

from src.database.models import HsJob, HsUserPermission
from src.database.models import HsHash, HsMask # for (un)packing directly
from src.database.models import HsRule, HsHcstat, HsDictionary, HsJobDictionary, HsJobRule, HsPcfg # for dependencies


# scalar or relationship fields that get copied over
JOB_EXPORTABLE_COLUMNS = (
  'attack', 'attack_mode', 'attack_submode', 'distribution_mode', 'hash_type', 'hashes',
  'keyspace', 'hc_keyspace', 'name', 'comment', 'seconds_per_workunit', 
  'charset1', 'charset2', 'charset3', 'charset4', 'rule_left', 'rule_right', 
  'markov_threshold', 'case_permute', 'check_duplicates', 
  'min_password_len', 'max_password_len', 'min_elem_in_chain', 
  'max_elem_in_chain', 'optimized', 'dict_deployment_mode',
  'device_types', 'workload_profile', 'slow_candidates', 'extra_hc_args',
  'fixed_workunit_size', 'rule_application_mode', 'deleted', 'masks'
)
# relationship fields that get stored as dependencies
JOB_EXPORTABLE_DEPENDENCIES = {
  # as {type}: {value to store for identification}
  'markov': 'name',
  'pcfg': 'name',
  'left_dictionaries': 'dictionary.name',
  'right_dictionaries': 'dictionary.name',
  'rules': 'rule.name',
}
# mapping of dependency names from db columns to tables
DEP_MAP = {
  'markov': 'markov',
  'pcfg': 'pcfg',
  'left_dictionaries': 'dictionary',
  'right_dictionaries': 'dictionary',
  'rules': 'rule',
}
# maps dep type annotations to actual sqlalchemy model classes and columns
ORM_MAP = {
  'rule': (HsRule, 'name'),
  'markov': (HsHcstat, 'name'),
  'pcfg': (HsPcfg, 'name'),
  'dictionary': (HsDictionary, 'name')
}

# Example for this craziness:
# ---------------------------
#
# EXPORTING:
# JOB_EXPORTABLE_DEPENDENCIES says for HsJob column left_dictionaries
# to access (if it is a list then for each element) dictionary.name
# and store its value in the dependency list. This is stored in the form
# 'type/value', type defined by DEP_MAP, ex. here 'dictionary/english.txt'.
# Jobs stored in the export reference these dependencies by their index
# in the dependency list.
#
# Ex: If job requires dicts english.txt and bible.txt, and the dep list is
# ['rule/best64.rule', 'dictionary/bible.txt', 'dictionary/english.txt']
# then the stored job will have 'left_dictionaries': [2, 1]
#
# IMPORTING:
# The function dependency_check uses ORM_MAP to find out which model class
# corresponds to the stored dependecny by its type (dictionary -> HsDictionary)
# and what column to search for the stored value (dictionary -> name). It then
# tries to find and return all the actual dependencies from DB or raises error.


class JobSerializer:
  """Creates a list of job dicts and a list of dependencies"""
  jobs = [] # jobs as dicts, referencing deps by index
  dependencies = [] # deps as '{type}/{identity value}' (type as per DEP_MAP)

  def __init__(self):
    # initialize job list (deps can stay cached)
    self.jobs = []

  def add (self, job):
    """Adds an HsJob record to the list"""
    result = {}
    # copy columns
    for field in JOB_EXPORTABLE_COLUMNS:
      result[field] = getattr(job, field)
    # record deps
    for dep in JOB_EXPORTABLE_DEPENDENCIES:
      dep_list = []
      # get the path to desired value for this dep type
      path = JOB_EXPORTABLE_DEPENDENCIES[dep].split('.')
      # read data
      data = getattr(job, dep)
      # if missing, skip
      if not data or (isinstance(data, list) and len(data) == 0):
        continue
      # normalize to list
      if not isinstance(data, list):
        data = [data]
      # iterate over the list
      for val in data:
        # descend nested values by the path from earlier
        for key in path:
          val = val[key] if isinstance(val, dict) else getattr(val, key)
        tv = '{}/{}'.format(DEP_MAP[dep], val)
        # check if this dep is already recorded, if not, add it
        try:
          dep_index = self.dependencies.index(tv)
        except ValueError:
          self.dependencies.append(tv)
          dep_index = len(self.dependencies) - 1
        # append the index of the dependency to the current dep in the job
        dep_list.append(dep_index)
      result[dep] = dep_list
    self.jobs.append(result)


def orm_pack (obj):
  """Describes to msgpack how to serialize some ORM objects"""
  if isinstance(obj, HsHash):
    obj = obj.hash
  if isinstance(obj, HsMask):
    obj = {
      'mask': obj.mask,
      'keyspace': obj.keyspace,
      'hc_keyspace': obj.hc_keyspace
    }
  return obj

def pack (**options):
  """
  Packs system data to portable package file
  """
  # options handling
  job_ids = options.get('jobs')

  # preparation
  package = {
    'packager': platform.node(),
    'timestamp': time.time()
  }

  # reading
  query = HsJob.query.filter_by(deleted=False)
  if job_ids:
    query = query.filter(HsJob.id.in_(job_ids))
  joblist = query.all()

  # transforming
  js = JobSerializer()

  for job in joblist:
    js.add(job)

  package['deps'] = js.dependencies
  package['jobs'] = js.jobs

  # packing
  packer = msgpack.Packer(use_bin_type=True, default=orm_pack)
  yield packer.pack(package)


class ImportDependencyMissing (Exception):
  """Raised when imported package references unmet dependencies"""

  def __init__(self, missing_deps):
    self.missing = missing_deps

def recreate_hash (hashstring, hashtype):
  return HsHash(hash=hashstring, hash_type=hashtype)

def recreate_mask (data):
  return HsMask(mask=data['mask'], keyspace=data['keyspace'], hc_keyspace=data['hc_keyspace'], current_index=0)

def unpack (package):
  """
  Unpacks system data from exported package and saves to DB
  """
  contents = msgpack.unpack(package)
  # load deps and check for missing
  deps, missing = dependency_check(contents['deps'])
  if len(missing) > 0:
    raise ImportDependencyMissing(missing)
  # start creating jobs
  for job in contents['jobs']:
    # transform directly stored object back
    job['hashes'] = list(map(lambda h: recreate_hash(h, job['hash_type']), job['hashes']))
    if job.get('masks'):
      job['masks'] = list(map(recreate_mask, job['masks']))
    newjob = HsJob()
    for field in JOB_EXPORTABLE_COLUMNS:
      setattr(newjob, field, job.get(field))
    # manual labor now
    #
    # !!! If you added new DEPS to export, make sure to unpack them like these !!!
    #
    dep_markov = job.get('markov')
    if dep_markov:
      newjob.markov = deps[dep_markov[0]]
    dep_left_dictionaries = job.get('left_dictionaries')
    if dep_left_dictionaries:
      for index in dep_left_dictionaries:
        jd = HsJobDictionary(is_left=1, dictionary=deps[index])
        newjob.left_dictionaries.append(jd)
    dep_right_dictionaries = job.get('right_dictionaries')
    if dep_right_dictionaries:
      for index in dep_right_dictionaries:
        jd = HsJobDictionary(is_left=0, dictionary=deps[index])
        newjob.right_dictionaries.append(jd)
    dep_rules = job.get('rules')
    if dep_rules:
      for index in dep_rules:
        jr = HsJobRule(rule=deps[index])
        newjob.rules.append(jr)
    dep_pcfg = job.get('pcfg')
    if dep_pcfg:
      newjob.pcfg = deps[dep_pcfg[0]]
    # adding values for useless non-null fields
    newjob.indexes_verified = 0
    newjob.current_index_2 = 0
    # add owner
    newjob.permission_records.append(HsUserPermission(user_id=current_user.id, view=1, modify=1, operate=1, owner=1))
    # save
    db.session.add(newjob)
  # end for loop over jobs
  try:
    db.session.commit()
  except exc.IntegrityError as e:
    db.session().rollback()
    raise e
    

def dependency_check (deps):
  missing = []
  records = []
  for dep in deps:
    dtype, dvalue = dep.split('/')
    dcls, col = ORM_MAP[dtype]
    # try to find by value
    dv = {col: dvalue}
    found = dcls.query.filter_by(**dv).filter_by(deleted=False).first()
    if not found:
      missing.append(dep)
    records.append(found)
  return records, missing
  