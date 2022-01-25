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

import os
import sys
import shlex
import typing
import platform
import warnings
import importlib
import setuptools
import subprocess


import importlib.util
import sys

warnings.filterwarnings("ignore")

CWD = Path = os.path.abspath(os.path.dirname(__file__))

file_path = os.path.join(CWD, "src", "version.py")
module_name = "version"

spec = importlib.util.spec_from_file_location(module_name, file_path)
module = importlib.util.module_from_spec(spec)
sys.modules[module_name] = module
spec.loader.exec_module(module)

Version = "{0}.{1}.{2}".format(
    sys.modules[module_name].__getattribute__("Version")[0],
    sys.modules[module_name].__getattribute__("Version")[1],
    sys.modules[module_name].__getattribute__("Version")[2]
)

Name = "Python-API-Service"

Debugging = os.environ["DISTUTILS_DEBUG"] = "1"
Distribution = Path + os.sep + "Artifact" + os.sep + "Distribution"
Environment = os.environ.get("VIRTUAL_ENV", False)
System = platform.system() in ["Linux", "Darwin", "Java"]
TTY = os.isatty(sys.stdin.fileno())

Any = typing.Any
List = typing.List

(print("Error: System is not Supported ...") and exit(128)) if not System else ...

if Environment and os.path.isdir(os.path.join(CWD, ".venv")):
    os.environ["VIRTUAL_ENV"] = os.path.dirname(__file__) + os.sep + ".venv"
else:
    subprocess.Popen(shlex.split("python3 -m pip install wheel --force-reinstall"), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8").communicate(None, timeout = 300)
    subprocess.Popen(shlex.split("python3 -m pip install virtualenv --force-reinstall"), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8").communicate(None, timeout = 300)
    subprocess.Popen(shlex.split("python3 -m pip install setuptools --force-reinstall"), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8").communicate(None, timeout = 300)

    subprocess.Popen(shlex.split("python3 -m virtualenv .venv --quiet"), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8").communicate(None, timeout = 300)

    os.environ["VIRTUAL_ENV"] = os.path.join(CWD, ".venv")

    subprocess.Popen(shlex.split("{0} -m pip install wheel --force-reinstall".format(os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"))), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8", env = os.environ).communicate(None, timeout = 300)
    subprocess.Popen(shlex.split("{0} -m pip install virtualenv --force-reinstall".format(os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"))), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8", env = os.environ).communicate(None, timeout = 300)
    subprocess.Popen(shlex.split("{0} -m pip install setuptools --force-reinstall".format(os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"))), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8", env = os.environ).communicate(None, timeout = 300)
    subprocess.Popen(shlex.split("{0} -m pip install --requirement requirements.txt --force-reinstall".format(os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"))), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8", env = os.environ).communicate(None, timeout = 300)

Installer = setuptools.setup
Packages = setuptools.find_packages

subprocess.Popen(shlex.split("{0} -m pip install certifi --force-reinstall".format(os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"))), shell = False, stdout = subprocess.PIPE, stdin = subprocess.PIPE, stderr = subprocess.PIPE, encoding = "UTF-8").communicate(None, timeout = 300)
command = shlex.split("{0} {1}.py".format(
    os.path.join(os.environ["VIRTUAL_ENV"], "bin", "python3"), Path + os.sep + "Install-Certificate")
)

process = subprocess.Popen(
    args = command,
    shell = False,
    stdin = subprocess.DEVNULL,
    stdout = subprocess.PIPE,
    stderr = subprocess.PIPE
).communicate(None, timeout = 300)

setuptools.setup(version = Version)
