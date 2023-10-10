FROM ubuntu:22.04

# Configure timezone
ENV TZ UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Configure noninteractive keyboard configuration
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get -y update && apt install --no-install-recommends -yq \
    curl \
    wget \
    sudo \
    mysql-server \
    mysql-client \
    build-essential \
    m4 \
    dh-autoreconf \
    pkg-config \
    git \
    libmysqlclient-dev \
    zlib1g \
    zlib1g-dev \
    liblzma-dev \
    libcurl4-openssl-dev \
    perl \
    libcompress-raw-lzma-perl \
    php \
    php-xml \
    php-mysql \
    php-cli \
    php-gd \
    python3 \
    python3-pymysql \
    python3-pip \
    python3-mysqldb \
    python-is-python3 \
    apache2 \
    apache2-utils \
    libapache2-mod-php \
    libapache2-mod-wsgi-py3 \
    g++-mingw-w64-x86-64 \
    npm \
    cpanminus \
    nano \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN cpanm -q Compress::Raw::Zlib Compress::Raw::Lzma
