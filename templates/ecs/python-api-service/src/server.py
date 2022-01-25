#!/usr/bin/env python3

# -*- Coding: UTF-8 -*-
# -*- System: Linux -*-
# -*- Usage:   *.*  -*-

# Owner:    Cloud-Technology LLC.
# Project:  Nexus-API - Python
# License:  BSD 1-Clause License

#
# Copyright 2021 Jacob B. Sanders - Cloud Hybrid LLC. & Affiliates
#
# Redistribution and use in source and binary forms, with or without modification, are permitted
# provided that the following conditions are met:
#
# 1.  Redistributions of source code must retain the above copyright notice, this list of
#     conditions and the following disclaimer.
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

import datetime
import os
from dataclasses import dataclass

import fastapi.responses
import uvicorn
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from uvicorn.middleware.debug import DebugMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

Integer = int
Boolean = bool
String = str

Schema = dataclass

from enum import Enum

class Status(str, Enum):
    """
    Status Enumeration
    """

    Online = "ONLINE"
    Offline = "OFFLINE"


@Schema
class Health:
    """
    Health Check Schema
    """

    Status: Status
    Time: int

    @staticmethod
    def generate():
        return Health(Status("ONLINE"), int(datetime.datetime.utcnow().timestamp()))

class Base:
    """
    ...
    """

    API: fastapi.FastAPI = fastapi.FastAPI(
        title="API",
        debug=True,
        docs_url="/" + "documentation",
        redoc_url="/"
    )

    API.add_middleware(
        CORSMiddleware,
        allow_credentials=False,  # No Need for Cookies
        allow_methods=["*"],
        allow_headers=[
            "*",
            "X-Guarantee-Token",
            "X-Guarantee-Type",
            "X-Guarantee-Server",
            "X-Guarantee-User",
            "X-Guarantee-Scopes"
        ],
        expose_headers=["*"],  # Testing
        max_age=30,  # Cache Age for CORs
        allow_origins=["*"]
    )

    API.add_middleware(GZipMiddleware)
    API.add_middleware(ProxyHeadersMiddleware)
    API.add_middleware(DebugMiddleware)

    def __init__(self, *argv, **kwargs):

        self.settings = Settings = uvicorn.config.Config(
            app=self.API,
            host="localhost",
            port=3000,
            use_colors=True,
            log_level=5,
            loop="auto",
            access_log=True,
            debug=True,
            workers=os.cpu_count(),
            root_path="/",
            headers=[("Server", "Nexus")],
            forwarded_allow_ips="*",
            timeout_keep_alive=10,
            timeout_notify=15,
            http="httptools",
            lifespan="on",
            backlog=8192
        )

        print(self.settings)

        self.server = uvicorn.Server(self.settings)

    #

    @staticmethod
    @API.get(path="/" + "health", tags=["General"], status_code=200, response_model=Health)
    async def Health():
        """\
        # Health-Check #

        The `ASGI` Web-Application will return a JSON, 200 Response upon
        Initialization.

        ## References ##
        - [Cloud-Technology.IO](https://cloud-technology.io)
        """

        return Health.generate()
