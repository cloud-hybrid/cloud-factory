#!/usr/local/bin/docker

# -*- Coding: UTF-8 -*-
# -*- System: Linux -*-
# -*- Usage:   *.*  -*-

# Owner: Jacob B. Sanders
# Source: gitlab.cloud-technology.io
# License: BSD 3-Clause License

#
# Copyright 2021, Jacob B. Sanders - Cloud Technology LLC. & Affiliates
#
# Redistribution and use in source and binary forms, with or without modification, are permitted
# provided that the following conditions are met:
#
# 1.  Redistributions of source code must retain the above copyright notice, this list of
#     conditions and the following disclaimer.
#
# 2.   Redistributions in binary form must reproduce the above copyright notice, this list of
#      conditions and the following disclaimer in the documentation and/or other materials
#      provided with the distribution.
#
# 3.  Neither the name of the copyright holder nor the names of its contributors may be used
#     to endorse or promote products derived from this software without specific prior written
#     permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
# OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
# AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
# OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
# OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
# OF SUCH DAMAGE.
#

FROM python:alpine

#
# =================================================================================================
# Python Alpine Container Image
# =================================================================================================
# >>> docker build --tag nexus-api:latest . --file Dockerfile ? [--no-cache]
# >>> docker run --publish 3000:3000 nexus-api:latest ? [--detach]
# >>> export CONTAINER_ID="$( docker run --publish 3000:3000 nexus-api:latest ? [--detach] )"
# >>> docker logs "${CONTAINER_ID}"
#
# ... Accepting connections at http://localhost:3000
#
# Common Docker Commands
# -----------------------
# --> Building, Listing, & Running Container Image(s)
# >>> docker build --tag [Image-Tag-Name]/[Image-Version] [ "." || ? --file [File-Name] ]
#
# --> Listing Container Images
# >>> docker images
# ... REPOSITORY                            TAG        ID              CREATED
# ... [Image-Tag-Name]/[Image-Version]      latest     d64d3505b0d2    1 minute ago
#
# --> Starting the Container
# >>> export CONTAINER_ID="$( docker run --publish 3000:3000 --detach [Image-Tag-Name]/[Image-Version] )"
#
# --> Print Application Logs via Container ID
# >>> docker logs "${CONTAINER_ID}"
# ... "Running On http://localhost:3000/
#
# --> Accessing & Spawning a TTY within the Container
# >>> docker exec -it "${CONTAINER_ID}" /bin/bash
#
# --> Testing the Container & Application via Host
# >>> curl -i localhost:49160
#
# --> Stop the Container + Application
# >>> docker stop ${CONTAINER_ID}
#
# --> Prune the System of Containers
# >>> docker system prune --all --force
#
# --> Prune the System of Container Images
# >>> docker images purge --all
#

MAINTAINER Jacob B. Sanders <jacob.sanders@cloudhybrid.io>

ENV LANG C.UTF-8

EXPOSE 3000:3000

# -------------------------------------------------------------------------------------------------
# Base Alpine Setup
# -------------------------------------------------------------------------------------------------

RUN echo -e "Installing Dependencies"       \
    && apk add --no-cache postgresql-libs   \
        && apk add --no-cache --virtual     \
            .build-deps                     \
            musl-dev                        \
            zlib-dev                        \
            libffi-dev                      \
                gcc                         \
                    cmake

RUN echo -e "Checking Version & Installing PIP" \
    && python --version && apk add py3-pip

RUN echo -e "Upgrading PIP" && pip3 install --upgrade pip 2>/dev/null

RUN echo -e "Installing AWS-CLI" \
    && pip3 install awscli

# - - - - - - - - - - - - - - - - - - -
# Container Entry-Point & Layer Cache
# - - - - - - - - - - - - - - - - - - -

RUN echo -e "Creating Application Directories" \
    && mkdir -p /Application

RUN echo -e "Copying Files from Host"

WORKDIR /Application

COPY *.whl /Application
COPY LICENSE /Application
COPY requirements.txt /Application

RUN echo -e "Installing Python Package(s)"              \
    && python -m venv .venv                             \
    && source .venv/bin/activate                        \
    && apk add build-base --quiet                       \
    && python -m pip install wheel                      \
    && python -m pip install --upgrade pip              \
        && python -m pip install -r requirements.txt

RUN echo -e "Refactoring Namespaces"                    \
    && mv "/Application/.venv/bin/python-api-service"   \
        "/Application/python-api-service"

RUN echo -e "Installing Source Wheel"   \
    && python -m pip install *.whl      \
        --force-reinstall

# - - - - - - - - -
# Cache & Clean-Up
# - - - - - - - - -

RUN export PCE="$(pip3 cache dir)"
RUN echo -e "Removing Container Local-Cache"    \
    && rm -rf /var/cache/apk/*                  \
        && rm -r -f "${PCE}"                    \
            && rm -r -f *.whl

CMD ["/Application/python-api-service"]
