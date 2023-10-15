'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

# coding: utf-8
import base64
import datetime
import math

from flask_login import UserMixin, AnonymousUserMixin, current_user
from sqlalchemy import BigInteger, Column, DateTime, Float, Integer, SmallInteger, Boolean, String, Table, Text, text, JSON, ForeignKey, \
    Numeric, func, LargeBinary, select, and_
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from werkzeug.security import check_password_hash, generate_password_hash

from src.api.hashstation.attacks.hashinfo import getHashNameById
from src.api.hashstation.functions import getStringBetween, get_batch_status
from src.api.hashstation.lang import job_status_text_to_code_dict, host_status_text_to_code_dict, \
    job_status_text_info_to_code_dict, status_to_code
from src.database import db

Base = db.Model


class HsBenchmark(Base):
    __tablename__ = 'hs_benchmark'

    id = Column(Integer, primary_key=True)
    boinc_host_id = Column(BigInteger, nullable=False)
    hash_type = Column(Integer) # 0 - MD5
    attack_mode = Column(Integer) # 0 - Dict attack
    power = Column(BigInteger, nullable=False, server_default=text("'0'"))
    last_update = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    def as_dict(self):
        return {
            'boinc_host_id': getattr(self, 'boinc_host_id'),
            'hash_type': getattr(self, 'hash_type'),
            'attack_mode': getattr(self, 'attack_mode'),
            'power': getattr(self, 'power'),
            'last_update': getattr(self, 'last_update').isoformat()
        }


class HsHost(Base):
    __tablename__ = 'hs_host'

    id = Column(BigInteger, primary_key=True)
    boinc_host_id = Column(ForeignKey('host.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    power = Column(BigInteger, nullable=False, server_default=text("'0'"))
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)
    status = Column(SmallInteger, nullable=False, server_default=text("'0'"))
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    @hybrid_property
    def status_text(self):
        return host_status_text_to_code_dict.get(self.status)

    boinc_host = relationship("Host", uselist=False)
    #devices = relationship("HsDevice", primaryjoin="HsHost.boinc_host_id==HsDevice.boinc_host_id", back_populates="host")


class HsDevice(Base):
    __tablename__ = 'hs_device'

    id = Column(BigInteger, primary_key=True)
    boinc_host_id = Column(BigInteger, ForeignKey('host.id'), nullable=False)
    hc_id = Column(BigInteger, nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)

    host = relationship("Host")
    device_info = relationship("HsDeviceInfo", back_populates="device", order_by="desc(HsDeviceInfo.id)", lazy='dynamic')
    #host = relationship("HsHost", primaryjoin="HsDevice.boinc_host_id==HsHost.boinc_host_id", back_populates="devices")
    #boinc_host = relationship("Host", uselist=False)


class HsDeviceInfo(Base):
    __tablename__ = 'hs_device_info'

    id = Column(BigInteger, primary_key=True)
    device_id = Column(BigInteger, ForeignKey('hs_device.id'), nullable=False)
    workunit_id = Column(BigInteger, ForeignKey('hs_workunit.id'), nullable=False)
    hashrate = Column(BigInteger, nullable=False)
    speed = Column(BigInteger, nullable=False)
    temperature = Column(Integer, nullable=False)
    utilization = Column(Integer, nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    device = relationship("HsDevice")
    workunit = relationship("HsWorkunit", back_populates="device_info")


class HsMask(Base):
    __tablename__ = 'hs_mask'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)
    mask = Column(String(30, 'utf8_bin'))
    current_index = Column(BigInteger, nullable=False)
    keyspace = Column(BigInteger, nullable=False)
    hc_keyspace = Column(BigInteger, nullable=False)

    job = relationship("HsJob", back_populates="masks")

    @hybrid_property
    def progress(self):
        if self.hc_keyspace == 0:
            return 0
        if self.job.status == 1:
            return 100
        return round((self.current_index / self.hc_keyspace) * 100, 2)


class HsDictionary(Base):
    __tablename__ = 'hs_dictionary'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    password_distribution = Column(Text(collation='utf8_bin'), nullable=False)
    keyspace = Column(BigInteger, nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    hex_dict = Column(Integer, nullable=False, server_default=text("'0'"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsPcfg(Base):
    __tablename__ = 'hs_pcfg_grammar'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    keyspace = Column(BigInteger, nullable=False)
    time_added = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsHcstat(Base):
    __tablename__ = 'hs_hcstats'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    path = Column(String(400), nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsMasksSet(Base):
    __tablename__ = 'hs_masks_set'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsCharset(Base):
    __tablename__ = 'hs_charset'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    keyspace = Column(BigInteger, nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsRule(Base):
    __tablename__ = 'hs_rule'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    count = Column(Integer, nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))


class HsJobDictionary(Base):
    __tablename__ = 'hs_job_dictionary'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)
    dictionary_id = Column(BigInteger, ForeignKey('hs_dictionary.id'), nullable=False)
    current_index = Column(BigInteger, nullable=False, server_default=text("'0'"))
    current_pos = Column(BigInteger, nullable=False, server_default=text("'0'"))
    is_left = Column(Integer, nullable=False, server_default=text("'1'"))
    dictionary = relationship("HsDictionary")

bin_job_junction = Table('hs_bin_job', Base.metadata,
    Column('job_id', Integer, ForeignKey('hs_job.id')),
    Column('bin_id', Integer, ForeignKey('hs_bin.id'))
)

class HsJobRule(Base):
    __tablename__ = 'hs_job_rule'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)
    rule_id = Column(BigInteger, ForeignKey('hs_rule.id'), nullable=False)
    rule = relationship("HsRule")

class HsJob(Base):
    __tablename__ = 'hs_job'

    id = Column(BigInteger, primary_key=True)
    attack = Column(String(20, 'utf8_bin'), nullable=False)
    attack_mode = Column(Integer, nullable=False)
    attack_submode = Column(Integer, nullable=False, server_default=text("'0'"))
    distribution_mode = Column(Integer, nullable=False, server_default=text("'0'"))
    hash_type = Column(Integer, nullable=False)
    status = Column(SmallInteger, nullable=False, server_default=text("'0'"))
    keyspace = Column(BigInteger, nullable=False)
    hc_keyspace = Column(BigInteger, nullable=False)
    indexes_verified = Column(BigInteger, nullable=False)
    current_index = Column(BigInteger, nullable=False, server_default=text("'0'"))
    current_index_2 = Column(BigInteger, nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    name = Column(Text(collation='utf8_bin'), nullable=False)
    comment = Column(Text(collation='utf8_bin'), nullable=False)
    time_start = Column(DateTime)
    time_end = Column(DateTime)
    seconds_per_workunit = Column(BigInteger, nullable=False, server_default=text("'600'"))
    charset1 = Column(String(4096, 'utf8_bin'))
    charset2 = Column(String(4096, 'utf8_bin'))
    charset3 = Column(String(4096, 'utf8_bin'))
    charset4 = Column(String(4096, 'utf8_bin'))
    rule_left = Column(String(255, 'utf8_bin'))
    rule_right = Column(String(255, 'utf8_bin'))
    markov_hcstat = Column(String(100, 'utf8_bin'), ForeignKey('hs_hcstats.name'))
    markov_threshold = Column(Integer, nullable=False, server_default=text("'0'"))
    grammar_id = Column(BigInteger, ForeignKey('hs_pcfg_grammar.id'), nullable=False)
    case_permute = Column(Integer, nullable=False, server_default=text("'0'"))
    check_duplicates = Column(Integer, nullable=False, server_default=text("'1'"))
    min_password_len = Column(Integer, nullable=False, server_default=text("'1'"))
    max_password_len = Column(Integer, nullable=False, server_default=text("'8'"))
    min_elem_in_chain = Column(Integer, nullable=False, server_default=text("'1'"))
    max_elem_in_chain = Column(Integer, nullable=False, server_default=text("'8'"))
    dict_deployment_mode = Column(Integer, nullable=False, server_default=text("'0'"))
    optimized = Column(Integer, nullable=False, server_default=text("'1'"))
    device_types = Column(Integer, nullable=False, server_default=text("'0'"))
    workload_profile = Column(Integer, nullable=False, server_default=text("'0'"))
    priority = Column(Integer, nullable=False, server_default=text("'1'"))
    slow_candidates = Column(Integer, nullable=False, server_default=text("'0'"))
    extra_hc_args = Column(String(4096, 'utf8_bin'))
    fixed_workunit_size = Column(BigInteger, nullable=False, server_default=text("'0'"))
    rule_application_mode = Column(Integer, nullable=False, server_default=text("'0'"))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))
    kill = Column(Integer, nullable=False, server_default=text("'0'"))
    batch_id = Column(ForeignKey('hs_batch.id', ondelete='SET NULL'), index=True)
    queue_position = Column(Integer)

    permission_records = relationship("HsUserPermission",
                          primaryjoin="HsJob.id==HsUserPermission.job_id")

    batch = relationship("HsBatch", back_populates="jobs")

    workunits = relationship("HsWorkunit")
    masks = relationship('HsMask')
    status_history = relationship('HsJobStatus')

    markov = relationship("HsHcstat",
                          primaryjoin="HsJob.markov_hcstat==HsHcstat.name")

    pcfg = relationship("HsPcfg",
                          primaryjoin="HsJob.grammar_id==HsPcfg.id")

    hosts = relationship("Host", secondary="hs_host_activity",
                         primaryjoin="HsJob.id == HsHostActivity.job_id",
                         secondaryjoin="HsHostActivity.boinc_host_id == Host.id",
                         viewonly=True)

    left_dictionaries = relationship("HsJobDictionary", primaryjoin=and_(HsJobDictionary.job_id == id, HsJobDictionary.is_left == True))
    right_dictionaries = relationship("HsJobDictionary", primaryjoin=and_(HsJobDictionary.job_id == id, HsJobDictionary.is_left == False), overlaps="left_dictionaries")
    rules = relationship('HsJobRule')

    @hybrid_property
    def cracked_hashes_str(self):
        cracked = len([hash.result for hash in self.hashes if hash.result != None])
        total = len(self.hashes)
        if total == 0:
            return ""
        return "{} % ({}/{})".format(int((cracked * 100)/total), cracked, total)

    @hybrid_property
    def priority_str(self):
        levels = ["High", "Normal", "Low"]
        return levels[self.priority]

    @hybrid_property
    def host_count(self):
        return len(self.hosts)

    @hybrid_property
    def total_time(self):
        if not self.time_start:
            return 0
        else:
            now = datetime.datetime.utcnow()
            if now < self.time_start:
                # Planned job
                return 0

            # Compute job total cracking time from job status history table
            total_time = 0
            last_run_time = self.time_start
            for item in self.status_history:
                # Skip all status change events before job start
                if item.time <= self.time_start:
                    continue

                code = int(item.status)
                if code == status_to_code['running']:
                    # Job resumed
                    last_run_time = item.time

                if (code == status_to_code['ready'] or code == status_to_code['finished'] or \
                    code == status_to_code['timeout'] or code == status_to_code['exhausted'] or \
                    code == status_to_code['malformed']) and last_run_time:
                    # Job paused/ended
                    total_time += (item.time - last_run_time).total_seconds()
                    last_run_time = None

            if last_run_time:
                # Job is running
                total_time += (now - last_run_time).total_seconds()

            return total_time

    @hybrid_property
    def workunit_sum_time(self):
        if not self.time_start:
            return 0
        return sum([wu.cracking_time for wu in self.workunits if wu.time >= self.time_start])

    @hybrid_property
    def efficiency(self):
        if not self.time_start:
            return 0
        # Hosts which did more work on the job than just benchmarks
        wu_active_hosts = [wu.boinc_host_id for wu in self.workunits if wu.hc_keyspace > 0 and wu.time >= self.time_start]
        job_active_hosts_count = len(set(wu_active_hosts))
        if job_active_hosts_count == 0 or self.workunit_sum_time == 0.0 or self.total_time == 0.0:
            return 0
        benchmarks_sum_time = sum([wu.cracking_time for wu in self.workunits if wu.hc_keyspace == 0 and wu.time >= self.time_start])
        job_eff = (float(self.workunit_sum_time) - float(benchmarks_sum_time)) / (job_active_hosts_count * self.total_time)
        return int(min(job_eff, 1.0) * 100)


    @hybrid_property
    def hash_type_name(self):
        return getHashNameById(self.hash_type)
    
    @hybrid_property
    def rules_multiplifier(self):
        rules_multiplier = 0
        if self.rule_application_mode == 0:
            for job_rule in self.rules:
                rules_multiplier += job_rule.rule.count
        elif self.rule_application_mode == 1: # dot product
            rules_multiplier = 1
            for job_rule in self.rules:
                rules_multiplier *= job_rule.rule.count
        return rules_multiplier

    @hybrid_property
    def workunit_sum_time_str(self):
        try:
            return str(datetime.timedelta(seconds=math.floor(self.workunit_sum_time)))
        except OverflowError:
            return 'really long'

    @hybrid_property
    def estimated_cracking_time_str(self):
        boinc_host_ids = [host.id for host in self.hosts if host.last_active.online]
        jobHosts = HsHost.query.filter(HsHost.job_id == self.id). \
            filter(HsHost.boinc_host_id.in_(boinc_host_ids)).all()

        hostsPower = {}
        for host in jobHosts:
            hostsPower[host.boinc_host_id] = host.power

        hostBenchmarks = HsBenchmark.query.filter(HsBenchmark.hash_type == self.hash_type). \
            filter(HsBenchmark.attack_mode == self.attack_mode). \
            filter(HsBenchmark.boinc_host_id.in_(boinc_host_ids)).all()

        if not hostBenchmarks:
            # We were unable to find benchmark data for (host, job_hash_type, job_attack_mode).
            # Instead of no data, try to use less precise data for (host, job_hash_type, X)
            # where X is any attack mode
            hostBenchmarks = HsBenchmark.query.filter(HsBenchmark.hash_type == self.hash_type). \
                filter(HsBenchmark.boinc_host_id.in_(boinc_host_ids)).all()

        total_power = 0
        for benchmark in hostBenchmarks:
            if hostsPower.get(benchmark.boinc_host_id, 0) == 0:
                total_power += benchmark.power
            else:
                total_power += hostsPower[benchmark.boinc_host_id]

        est_time = None
        if (total_power > 0):
            est_time = float(self.keyspace / total_power)
            try:
                time_delta = datetime.timedelta(seconds=math.floor(est_time))
                if time_delta.total_seconds() < 60:
                    est_time = 'About a minute'
                else:
                    est_time = str(time_delta)
            except OverflowError:
                est_time = 'Really long'
        return est_time

    @hybrid_property
    def progress(self):
        if self.hc_keyspace == 0:
            return 100
        elif self.status == 1:
            return 100
        elif self.status == 2:
            return 100
        elif self.attack_mode in [1, 6, 7]:
            return round((self.indexes_verified / self.keyspace) * 100)
        else:
            return round((self.indexes_verified / self.hc_keyspace) * 100)

    @progress.expression
    def progress(cls):
        return func.round((cls.indexes_verified / func.ifnull(cls.hc_keyspace, 0)) * 100)

    @hybrid_property
    def status_text(self):
        return job_status_text_to_code_dict.get(int(self.status))

    @hybrid_property
    def status_tooltip(self):
        return job_status_text_info_to_code_dict.get(int(self.status))

    @hybrid_property
    def status_type(self):
        code = int(self.status)
        if code == status_to_code['ready'] or code == status_to_code['running'] or code == status_to_code['finishing']:
            return 'info'
        if code == status_to_code['finished']:
            return 'success'
        if code == status_to_code['timeout']:
            return 'warning'
        if code == status_to_code['exhausted'] or code == status_to_code['malformed']:
            return 'error'

    @hybrid_property
    def permissions(self):
        base = {'view': False, 'edit': False, 'operate': False, 'owner': False}
        record = db.session.query(HsUserPermission).filter_by(user_id=current_user.id).filter_by(job_id=self.id).one_or_none()
        if record:
            if record.owner:
                base = {'view': True, 'edit': True, 'operate': True, 'owner': True}
            else:
                base['view'] = record.view
                base['edit'] = record.modify
                base['operate'] = record.operate
        return base

    hashes = relationship("HsHash", back_populates="job")

class HsBin(Base):
    __tablename__ = 'hs_bin'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    position = Column(Integer)

    jobs = relationship('HsJob',
                    secondary=bin_job_junction,
                    backref="bins",
                    lazy='dynamic',
                    passive_deletes=True)

    @hybrid_property
    def job_count(self):
        query = self.jobs
        if not current_user.role.VIEW_ALL_JOBS:
            ids = db.session.query(HsUserPermission.job_id).filter_by(user_id=current_user.id).filter_by(view=1).all()
            ids = [x[0] for x in ids]
            query = query.filter(HsJob.id.in_(ids))
        
        return query.filter(HsJob.deleted == 0).count()

class HsBatch(Base):
    __tablename__ = 'hs_batch'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    creator_id = Column(ForeignKey('hs_user.id', ondelete='SET NULL'), index=True)

    creator = relationship("HsUser", backref="batches")
    jobs = relationship("HsJob")

    @hybrid_property
    def total_jobs(self):
        return len(self.jobs)

    @hybrid_property
    def waiting_jobs(self):
        return len([job for job in self.jobs if job.status == 0])

    @hybrid_property
    def status(self):
        return get_batch_status(self.total_jobs, self.waiting_jobs, len([job for job in self.jobs if job.status >= 10]) > 0)

    @hybrid_property
    def current_user_can_edit(self):
        return self.creator_id == current_user.id or current_user.role.EDIT_ALL_JOBS

    @hybrid_property
    def current_user_can_operate(self):
        return self.creator_id == current_user.id or current_user.role.OPERATE_ALL_JOBS

class HsTemplate(Base):
    __tablename__ = 'hs_template'

    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    created = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    template = Column(JSON, nullable=False)

class HsSettings(Base):
    __tablename__ = 'hs_settings'

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('hs_user.id'))
    default_seconds_per_workunit = Column(Integer, nullable=False, server_default=text("'600'"))
    workunit_timeout_factor = Column(Integer, nullable=False, server_default=text("'2'"))
    hwmon_temp_abort = Column(Integer, nullable=False, server_default=text("'90'"))
    bench_all = Column(Integer, nullable=False, server_default=text("'1'"))
    verify_hash_format = Column(Integer, nullable=False, server_default=text("'1'"))
    auto_add_hosts_to_running_jobs = Column(Integer, nullable=False, server_default=text("'0'"))
    bench_runtime_limit = Column(Integer, nullable=False, server_default=text("'30'"))
    workunit_status_update = Column(Integer, nullable=False, server_default=text("'5'"))

    discord_notifications = Column(Integer, nullable=False, server_default=text("'0'"))
    discord_webhook_id = Column(String(200), nullable=True)
    discord_webhook_token = Column(String(200), nullable=True)
    telegram_notifications = Column(Integer, nullable=False, server_default=text("'0'"))
    telegram_bot_token = Column(String(200), nullable=True)
    telegram_chat_id = Column(String(200), nullable=True)
    email_notifications = Column(Integer, nullable=False, server_default=text("'0'"))
    email_address = Column(String(200), nullable=True)
    email_password = Column(String(200), nullable=True)

    user = relationship('HsUser')

class HsJobGraph(Base):
    __tablename__ = 'hs_job_graph'

    id = Column(BigInteger, primary_key=True)
    progress = Column(Numeric(5, 2), nullable=False)
    job_id = Column(ForeignKey('hs_job.id'), nullable=False, index=True)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    job = relationship('HsJob')

    def as_graph(self):
        return {
            'time': str(getattr(self, 'time')),
            getattr(self.job, 'id'): min(round(getattr(self, 'progress')), 100)
        }


class HsJobStatus(Base):
    __tablename__ = 'hs_job_status'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(ForeignKey('hs_job.id'), nullable=False, index=True)
    status = Column(SmallInteger, nullable=False, server_default=text("'0'"))
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    @hybrid_property
    def status_text(self):
        return job_status_text_to_code_dict.get(int(self.status))

    @hybrid_property
    def status_tooltip(self):
        return job_status_text_info_to_code_dict.get(int(self.status))

    @hybrid_property
    def status_type(self):
        code = int(self.status)
        if code == status_to_code['ready'] or code == status_to_code['running'] or code == status_to_code['finishing']:
            return 'info'
        if code == status_to_code['finished']:
            return 'success'
        if code == status_to_code['timeout']:
            return 'warning'
        if code == status_to_code['exhausted'] or code == status_to_code['malformed']:
            return 'error'

    job = relationship('HsJob')


class Host(Base):
    __tablename__ = 'host'

    id = Column(Integer, primary_key=True)
    create_time = Column(Integer, nullable=False)
    userid = Column(Integer, ForeignKey('user.id'))
    rpc_seqno = Column(Integer, nullable=False)
    rpc_time = Column(Integer, nullable=False)
    total_credit = Column(Float(asdecimal=True), nullable=False, index=True)
    expavg_credit = Column(Float(asdecimal=True), nullable=False, index=True)
    expavg_time = Column(Float(asdecimal=True), nullable=False)
    timezone = Column(Integer, nullable=False)
    domain_name = Column(String(254))
    serialnum = Column(String(254))
    last_ip_addr = Column(String(254))
    nsame_ip_addr = Column(Integer, nullable=False)
    on_frac = Column(Float(asdecimal=True), nullable=False)
    connected_frac = Column(Float(asdecimal=True), nullable=False)
    active_frac = Column(Float(asdecimal=True), nullable=False)
    cpu_efficiency = Column(Float(asdecimal=True), nullable=False)
    duration_correction_factor = Column(Float(asdecimal=True), nullable=False)
    p_ncpus = Column(Integer, nullable=False)
    p_vendor = Column(String(254))
    p_model = Column(String(254))
    p_fpops = Column(Float(asdecimal=True), nullable=False)
    p_iops = Column(Float(asdecimal=True), nullable=False)
    p_membw = Column(Float(asdecimal=True), nullable=False)
    os_name = Column(String(254))
    os_version = Column(String(254))
    m_nbytes = Column(Float(asdecimal=True), nullable=False)
    m_cache = Column(Float(asdecimal=True), nullable=False)
    m_swap = Column(Float(asdecimal=True), nullable=False)
    d_total = Column(Float(asdecimal=True), nullable=False)
    d_free = Column(Float(asdecimal=True), nullable=False)
    d_boinc_used_total = Column(Float(asdecimal=True), nullable=False)
    d_boinc_used_project = Column(Float(asdecimal=True), nullable=False)
    d_boinc_max = Column(Float(asdecimal=True), nullable=False)
    n_bwup = Column(Float(asdecimal=True), nullable=False)
    n_bwdown = Column(Float(asdecimal=True), nullable=False)
    credit_per_cpu_sec = Column(Float(asdecimal=True), nullable=False)
    venue = Column(String(254), nullable=False)
    nresults_today = Column(Integer, nullable=False)
    avg_turnaround = Column(Float(asdecimal=True), nullable=False)
    host_cpid = Column(String(254))
    external_ip_addr = Column(String(254))
    max_results_day = Column(Integer, nullable=False)
    error_rate = Column(Float(asdecimal=True), nullable=False, server_default=text("'0'"))
    product_name = Column(String(254), nullable=False)
    gpu_active_frac = Column(Float(asdecimal=True), nullable=False)
    p_ngpus = Column(Integer, nullable=False)
    p_gpu_fpops = Column(Float(asdecimal=True), nullable=False)

    user = relationship("User", back_populates="hosts")

    devices = relationship("HsDevice", primaryjoin="Host.id == HsDevice.boinc_host_id", back_populates="host")

    workunits = relationship("HsWorkunit", secondary="hs_host_activity",
                        primaryjoin="Host.id == HsHostActivity.boinc_host_id",
                        secondaryjoin="HsHostActivity.job_id == HsWorkunit.id",
                        order_by="desc(HsWorkunit.id)")

    last_active = relationship("HsHostStatus", uselist=False)

    jobs = relationship("HsJob", secondary="hs_host_activity",
                        primaryjoin="Host.id == HsHostActivity.boinc_host_id",
                        secondaryjoin="HsHostActivity.job_id == HsJob.id",
                        viewonly=True)

    @hybrid_property
    def deleted(self):
        return True if \
            HsHostStatus.query.filter(HsHostStatus.boinc_host_id == self.id, HsHostStatus.deleted == True).first() \
            else False


class HsWorkunit(Base):
    __tablename__ = 'hs_workunit'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)
    workunit_id = Column(BigInteger, ForeignKey('result.workunitid', onupdate="NO ACTION", ondelete="NO ACTION"), nullable=False)
    host_id = Column(BigInteger, ForeignKey('hs_host.id'), nullable=False)
    boinc_host_id = Column(Integer, ForeignKey('host.id'), nullable=False)
    start_index = Column(BigInteger, nullable=False)
    start_index_2 = Column(BigInteger, nullable=False)
    hc_keyspace = Column(BigInteger, nullable=False)
    progress = Column(Float(asdecimal=True), nullable=False, server_default=text("'0'"))
    speed = Column(BigInteger, nullable=False, server_default=text("'0'"))
    hashrate = Column(BigInteger, nullable=False, server_default=text("'0'"))
    remaining_time = Column(BigInteger, nullable=False, server_default=text("'0'"))
    mask_id = Column(BigInteger, ForeignKey('hs_mask.id'), nullable=False)
    dictionary_id = Column(BigInteger, nullable=False)
    duplicated = Column(Integer, nullable=False, server_default=text("'0'"))
    duplicate = Column(BigInteger, nullable=False, server_default=text("'0'"))
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    cracking_time = Column(Float(asdecimal=True), nullable=False, server_default=text("'0'"))
    retry = Column(Integer, nullable=False, server_default=text("'0'"))
    finished = Column(Integer, nullable=False, server_default=text("'0'"))

    job = relationship("HsJob", back_populates="workunits")
    host = relationship("Host", back_populates="workunits")
    mask = relationship('HsMask')
    device_info = relationship("HsDeviceInfo")

    result = relationship('Result',  uselist=False, primaryjoin="HsWorkunit.workunit_id==Result.workunitid", viewonly=True)

    @hybrid_property
    def keyspace(self):
        if self.job.attack_mode == 3:
            return self.hc_keyspace * (self.mask.keyspace / self.mask.hc_keyspace)
        if self.job.rules:
            return self.hc_keyspace * self.job.rules_multiplifier
        return self.hc_keyspace

    @hybrid_property
    def start_index_real(self):
        if self.job.attack_mode in [1,6,7]:
            return self.start_index * self.job.hc_keyspace + self.start_index_2
        if self.job.attack_mode == 3:
            return self.start_index * (self.mask.keyspace / self.mask.hc_keyspace)
        if self.job.rules:
            return self.start_index * self.job.rules_multiplifier
        return self.start_index

    def as_graph(self):
        return {
            'time': str(getattr(self, 'time')),
            str(getattr(self, 'boinc_host_id'))
            + '_' + str(getattr(self, 'job_id')): int(getattr(self, 'hc_keyspace'))
        }

    @hybrid_property
    def cracking_time_str(self):
        return str(datetime.timedelta(seconds=math.floor(self.cracking_time)))

    @hybrid_property
    def remaining_time_str(self):
        if not self.finished: # active wu
            if self.keyspace == 0: # benchmark wu has runtime limit in seconds
                settings = HsSettings.query.filter_by(user_id=current_user.id).one()
                remaining_time = 0 if self.cracking_time > settings.bench_runtime_limit else settings.bench_runtime_limit - self.cracking_time
                return str(datetime.timedelta(seconds=math.floor(remaining_time)))
            elif self.keyspace > 0: # normal wu
                return str(datetime.timedelta(seconds=math.floor(self.remaining_time)))
        return "–"


class HsHostActivity(Base):
    __tablename__ = 'hs_host_activity'

    id = Column(BigInteger, primary_key=True)
    boinc_host_id = Column(Integer, ForeignKey('host.id'), nullable=False)
    job_id = Column(BigInteger, ForeignKey('hs_job.id'), nullable=False)

    boinc_host = relationship("Host")

    @hybrid_property
    def host(self):
        return self.boinc_host.hs_host


class HsNotification(Base):
    __tablename__ = 'hs_notification'

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('hs_user.id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    source_type = Column(Integer, server_default=text("'0'"))
    source_id = Column(ForeignKey('hs_job.id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    old_value = Column(SmallInteger)
    new_value = Column(SmallInteger)
    seen = Column(Integer, server_default=text("'0'"))
    discord_sent = Column(Integer, server_default=text("'0'"))
    telegram_sent = Column(Integer, server_default=text("'0'"))
    email_sent = Column(Integer, server_default=text("'0'"))
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    source = relationship('HsJob')
    user = relationship('HsUser')


class HsRole(Base):
    __tablename__ = 'hs_role'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    MANAGE_USERS = Column(Integer, nullable=False, server_default=text("'0'"))
    ADD_NEW_JOB = Column(Integer, nullable=False, server_default=text("'0'"))
    UPLOAD_DICTIONARIES = Column(Integer, nullable=False, server_default=text("'0'"))
    VIEW_ALL_JOBS = Column(Integer, nullable=False, server_default=text("'0'"))
    EDIT_ALL_JOBS = Column(Integer, nullable=False, server_default=text("'0'"))
    OPERATE_ALL_JOBS = Column(Integer, nullable=False, server_default=text("'0'"))
    ADD_USER_PERMISSIONS_TO_JOB = Column(Integer, nullable=False, server_default=text("'0'"))


class HsUser(UserMixin, Base):
    __tablename__ = 'hs_user'

    id = Column(Integer, primary_key=True)
    username = Column(String(64), nullable=False)
    password = Column(String(128), nullable=False)
    mail = Column(String(200), nullable=False)
    role_id = Column(ForeignKey('hs_role.id'), nullable=False, index=True)
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))

    def set_password(self, password):
        setattr(self, 'password', generate_password_hash(password))

    def check_password(self, password):
        return check_password_hash(getattr(self, 'password'), password)

    role = relationship('HsRole')

    def as_dict(self):
        return {
            'id': getattr(self, 'id'),
            'username': getattr(self, 'login'),
            'mail': getattr(self, 'mail'),
            'role': getattr(self, 'role')
        }

    stuffs = []

    def addStuff(self, stuff):
        self.stuffs.append(stuff)


class AnonUser(AnonymousUserMixin):
    id = 0
    username = 'Anon'
    stuffs = []

    def addStuff(self, stuff):
        self.stuffs.append(stuff)


class HsUserPermission(Base):
    __tablename__ = 'hs_user_permissions'

    id = Column(Integer, primary_key=True)
    job_id = Column(ForeignKey('hs_job.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    user_id = Column(ForeignKey('hs_user.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    view = Column(Integer, nullable=False, server_default=text("'0'"))
    modify = Column(Integer, nullable=False, server_default=text("'0'"))
    operate = Column(Integer, nullable=False, server_default=text("'0'"))
    owner = Column(Integer, nullable=False, server_default=text("'0'"))

    job = relationship('HsJob')
    user = relationship('HsUser')

    @hybrid_property
    def can_view(self): return self.view == 1 or self.owner == 1

    @hybrid_property
    def can_modify(self): return self.modify == 1 or self.owner == 1

    @hybrid_property
    def can_operate(self): return self.operate == 1 or self.owner == 1


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    create_time = Column(Integer, nullable=False)
    email_addr = Column(String(254), nullable=False, unique=True)
    name = Column(String(254), index=True)
    authenticator = Column(String(254), unique=True)
    country = Column(String(254))
    postal_code = Column(String(254))
    total_credit = Column(Float(asdecimal=True), nullable=False, index=True)
    expavg_credit = Column(Float(asdecimal=True), nullable=False, index=True)
    expavg_time = Column(Float(asdecimal=True), nullable=False)
    global_prefs = Column(LargeBinary)
    project_prefs = Column(LargeBinary)
    teamid = Column(Integer, nullable=False, index=True)
    venue = Column(String(254), nullable=False)
    url = Column(String(254))
    send_email = Column(SmallInteger, nullable=False)
    show_hosts = Column(SmallInteger, nullable=False)
    posts = Column(SmallInteger, nullable=False)
    seti_id = Column(Integer, nullable=False)
    seti_nresults = Column(Integer, nullable=False)
    seti_last_result_time = Column(Integer, nullable=False)
    seti_total_cpu = Column(Float(asdecimal=True), nullable=False)
    signature = Column(String(254))
    has_profile = Column(SmallInteger, nullable=False)
    cross_project_id = Column(String(254), nullable=False)
    passwd_hash = Column(String(254), nullable=False)
    email_validated = Column(SmallInteger, nullable=False)
    donated = Column(SmallInteger, nullable=False)
    login_token = Column(String(32), nullable=False)
    login_token_time = Column(Float(asdecimal=True), nullable=False)

    hosts = relationship('Host')


class HsEncryptedFile(Base):
    __tablename__ = 'hs_protected_file'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    path = Column(String(400), nullable=False)
    hash = Column(LargeBinary, nullable=False)
    hash_type = Column(String(50), nullable=False)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    @hybrid_property
    def hash_type_name(self):
        return getHashNameById(self.hash_type)


class HsHostStatus(Base):
    __tablename__ = 'hs_host_status'

    id = Column(BigInteger, primary_key=True)
    boinc_host_id = Column(Integer, ForeignKey(Host.id), nullable=False)
    last_seen = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    device_types = Column(Integer, nullable=False, server_default=text("'0'"))
    workload_profile = Column(Integer, nullable=False, server_default=text("'0'"))
    extra_hc_args = Column(String(4096, 'utf8_bin'))
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))

    @hybrid_property
    def seconds_delta(self):
        # TODO: Overflow?
        now = datetime.datetime.utcnow()
        then = self.last_seen
        delta = now - then
        total_seconds = math.floor(delta.total_seconds())
        return str(total_seconds)

    @hybrid_property
    def online(self):
        now = datetime.datetime.utcnow()
        then = self.last_seen
        delta = now - then
        total_seconds = math.floor(delta.total_seconds())
        return True if total_seconds <= 60 else False


class HsHash(Base):
    __tablename__ = 'hs_hash'

    id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey(HsJob.id), nullable=True)
    hash_type = Column(Integer, nullable=False)
    hash = Column(LargeBinary, nullable=False)
    username = Column(String(255), nullable=True)
    result = Column(String(400, collation='utf8_bin'))
    added = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    time_cracked = Column(DateTime)
    deleted = Column(Integer, nullable=False, server_default=text("'0'"))

    job = relationship("HsJob", back_populates="hashes")

    @hybrid_property
    def hashText(self):
        try:
            return self.hash.decode("utf-8")
        except UnicodeDecodeError:
            return "BASE64<{}>".format(base64.encodebytes(self.hash).decode("utf-8"))

    @hybrid_property
    def password(self):
        try:
            if self.result:
                return bytes.fromhex(self.result.rstrip()).decode('utf-8')
            else:
                return None
        except (UnicodeDecodeError, ValueError) as e:
            return "HEX<{}>".format(self.result)

    @hybrid_property
    def hash_type_name(self):
        return getHashNameById(self.hash_type)


class Result(Base):
    __tablename__ = 'result'

    id = Column(Integer, primary_key=True)
    create_time = Column(Integer, nullable=False)
    workunitid = Column(Integer, nullable=True)
    server_state = Column(Integer, nullable=False)
    outcome = Column(Integer, nullable=False)
    client_state = Column(Integer, nullable=False)
    hostid = Column(Integer, nullable=False)
    userid = Column(Integer, nullable=False)
    report_deadline = Column(Integer, nullable=False)
    sent_time = Column(Integer, nullable=False)
    received_time = Column(Integer, nullable=False)
    name = Column(String(254), nullable=False, unique=True)
    cpu_time = Column(Float(asdecimal=True), nullable=False)
    xml_doc_in = Column(LargeBinary)
    xml_doc_out = Column(LargeBinary)
    stderr_out = Column(LargeBinary)
    batch = Column(Integer, nullable=False)
    file_delete_state = Column(Integer, nullable=False, index=True)
    validate_state = Column(Integer, nullable=False)
    claimed_credit = Column(Float(asdecimal=True), nullable=False)
    granted_credit = Column(Float(asdecimal=True), nullable=False)
    opaque = Column(Float(asdecimal=True), nullable=False)
    random = Column(Integer, nullable=False)
    app_version_num = Column(Integer, nullable=False)
    appid = Column(Integer, nullable=False)
    exit_status = Column(Integer, nullable=False)
    teamid = Column(Integer, nullable=False)
    priority = Column(Integer, nullable=False)
    mod_time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    elapsed_time = Column(Float(asdecimal=True), nullable=False)
    flops_estimate = Column(Float(asdecimal=True), nullable=False)
    app_version_id = Column(Integer, nullable=False)
    runtime_outlier = Column(Integer, nullable=False)
    size_class = Column(SmallInteger, nullable=False, server_default=text("'-1'"))
    peak_working_set_size = Column(Float(asdecimal=True), nullable=False)
    peak_swap_size = Column(Float(asdecimal=True), nullable=False)
    peak_disk_usage = Column(Float(asdecimal=True), nullable=False)

    @hybrid_property
    def stderr_out_text(self):
        try:
            return getStringBetween(self.stderr_out.decode("utf-8"), '<stderr_txt>', '</stderr_txt>' ).replace('\r', '')
        except:
            return self.stderr_out.decode("utf-8", errors='ignore').replace('\r', '')
class HsServerUsage(Base):
    __tablename__ = 'hs_server_usage'

    id = Column(Integer, primary_key=True)
    time = Column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    cpu = Column(Float(asdecimal=True), nullable=False)
    ram = Column(Float(asdecimal=True), nullable=False)
    net_recv = Column(Integer, nullable=False)
    net_sent = Column(Integer, nullable=False)
    hdd_read = Column(Integer, nullable=False)
    hdd_write = Column(Integer, nullable=False)
