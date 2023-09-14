FROM base:latest

# Add BOINC server user and fitcrack group
RUN useradd -m -c "BOINC Administrator" boincadm -s /bin/bash && \
    groupadd fitcrack && \
    usermod -a -G fitcrack boincadm

# Apache with necessary mods
RUN a2enmod cgi
RUN a2enmod rewrite
RUN a2enmod wsgi

# Copy required files
COPY ../installer /srv/fitcrack/installer
COPY ../server /srv/fitcrack/server
COPY ../boinc /srv/fitcrack/boinc
COPY ../agent /srv/fitcrack/agent
COPY ../frontend /srv/fitcrack/frontend
COPY ../backend /srv/fitcrack/backend
COPY ../docker /srv/fitcrack/docker

# Boinc server build
WORKDIR /srv/fitcrack

# Apply fitcrack specific changes to boinc
RUN patch -p0 < installer/fitcrack_changes_in_boinc.patch

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

# Build Fitcrack server
WORKDIR /srv/fitcrack/boinc
RUN chmod +x _autosetup && ./_autosetup
RUN chmod +x configure && ./configure --disable-client --disable-manager
RUN make -j

# Backend setup
WORKDIR /srv/fitcrack/backend

RUN pip3 install -r src/requirements.txt
RUN cd hashcat-utils/src && make -j
RUN cd pwd_dist && make -j

# Frontend setup
WORKDIR /srv/fitcrack/frontend

RUN npm ci && npm run build

# Install project
WORKDIR /srv/fitcrack/

RUN chmod +x ./docker/docker-install-project.sh
RUN ./docker/docker-install-project.sh

EXPOSE 80
EXPOSE 5000

# Ensure Apache runs in the foreground
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

HEALTHCHECK --interval=5s --timeout=20s CMD ps -ef | grep apache2 | grep -v grep || exit 1