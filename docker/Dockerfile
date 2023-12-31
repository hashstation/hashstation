FROM base:latest

USER root

# Add BOINC server user and hashstation group
RUN useradd -m -c "BOINC Administrator" boincadm -s /bin/bash && \
    groupadd hashstation && \
    usermod -a -G hashstation boincadm

# Apache with necessary mods
RUN a2enmod cgi
RUN a2enmod rewrite
RUN a2enmod wsgi
RUN a2enmod headers

# Copy required files
COPY installer /srv/hashstation/installer
COPY server /srv/hashstation/server
COPY boinc /srv/hashstation/boinc
COPY agent /srv/hashstation/agent
COPY frontend /srv/hashstation/frontend
COPY backend /srv/hashstation/backend
COPY docker /srv/hashstation/docker

# Boinc server build
WORKDIR /srv/hashstation

# Apply hashstation specific changes to boinc
RUN patch -p0 < installer/hashstation_changes_in_boinc.patch

# Copy server files to BOINC server root
RUN cp -f server/src/headers/*.h              boinc/sched/
RUN cp -f server/src/headers/AttackModes/*.h  boinc/sched/
RUN cp -f server/src/headers/Generators/*.h   boinc/sched/
RUN cp -f server/src/headers/Database/*.h     boinc/sched/
RUN cp -f server/src/headers/Utils/*.h     boinc/sched/
RUN cp -f server/src/source/*.cpp             boinc/sched/
RUN cp -f server/src/source/AttackModes/*.cpp boinc/sched/
RUN cp -f server/src/source/Generators/*.cpp  boinc/sched/
RUN cp -f server/src/source/Database/*.cpp    boinc/sched/
RUN cp -f server/src/source/Utils/*.cpp    boinc/sched/
RUN cp -f server/src/headers/protocol/*.cc    boinc/sched/
RUN cp -f server/src/headers/protocol/*.h     boinc/sched/
RUN cp -rf server/src/include/*               boinc/sched/
RUN rm -f installer/.server_built 2>/dev/null

# Build Hashstation server
WORKDIR /srv/hashstation/boinc
RUN chmod +x _autosetup && ./_autosetup
RUN chmod +x configure && ./configure --disable-client --disable-manager
RUN make -j

# Backend setup
WORKDIR /srv/hashstation/backend

RUN pip3 install -r src/requirements.txt
RUN cd hashcat-utils/src && make -j hcstat2gen.bin
RUN cd pwd_dist && make -j

# Frontend setup
WORKDIR /srv/hashstation/frontend

RUN npm ci && npm run build

# Install project

ARG USER
ARG DB_HOST
ARG DB_NAME
ARG DB_USER
ARG DB_PW
ARG HASHSTATION_HOST
ARG HASHSTATION_PROTO
ARG BACKEND_PORT
ARG FRONTEND_PORT
ARG SSL_HASHSTATION
ARG HASHSTATION_USER
ARG HASHSTATION_EMAIL
ARG HASHSTATION_PW
ARG DYNAMIC_BACKEND_URL
ARG BOINC_HOST
ARG BOINC_PROTO
ARG BOINC_PORT
ARG SSL_BOINC
ARG BOINC_URL
ARG BOINC_USER
ARG BOINC_GROUP
ARG BOINC_HOME
ARG BOINC_PROJECT
ARG BOINC_PROJECT_DIR
ARG OPS_LOGIN
ARG OPS_PW
ARG SERVICE_INSTALL
ARG PROJECT_HTTPD_CONF
ARG SSL_CERTIFICATE_FILE
ARG SSL_CERTIFICATE_KEYFILE
ARG APACHE_USER
ARG APACHE_CONFIG_DIR
ARG APACHE_CONFIG_FILE
ARG APACHE_DOCUMENT_ROOT
ARG APACHE_SERVICE

WORKDIR /srv/hashstation/

RUN chmod +x ./docker/docker-install-project.sh
RUN ./docker/docker-install-project.sh

EXPOSE 80
EXPOSE 5000

ENTRYPOINT ["./docker/entrypoint.sh"]

HEALTHCHECK --interval=5s --timeout=20s CMD ps -ef | grep apache2 | grep -v grep || exit 1