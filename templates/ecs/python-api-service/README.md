# Nexus-API #

*The **[Test]** Cloud-Technology API*

[[_TOC_]]

## Overview ##

[Test] API is a set of HTTP endpoints that adhere to RESTful design principles and CRUD actions with
predictable URIs. It uses standard HTTP response codes & messages. The API has consistent and well-formed JSON
communication patterns with cursor-based, variable pagination to simplify list handling. Error messages are descriptive
and easy to understand.

All functional endpoints a part of the Cloud-Technology customer portal are accessible via the API, enabling Users to
script complex unattended scenarios with any tool capable of HTTP.

## Setup & Usage ##

### Requirements ###

- PIP-3
- OpenSSL
- Python3.9+

1. **Change Working Directories & Update PIP**:
    ```bash
    python3 -m pip install pip --upgrade
    ```
2. **Enable a Virtual Environment**:
    ```bash
    python3 -m venv .venv && source .venv/bin/activate
    ```
3. **Initialize a Hash Token**:
    ```bash
    export HASH_KEY="$(python3 -c "import secrets, sys; sys.stdout.write(secrets.token_urlsafe(32))")"
    ```
4. **Lastly**:
    ```bash
    python3 -m pip install wheel --force --upgrade
    python3 -m pip install --force --upgrade . 
    ```
    - Optionally, Developers & Contributors ***can and should*** run *in Development-Mode*:
        ```bash
        python3 -m python-api-service --Debug Server --TLS 
        ```

## Debugging ##

### SSL Verification Failure ###

```log
urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129)
```

**Run `python[3] Install-Certificate.py`**.

---

## Serverless Technologies ##

<details>

<summary>Fargate</summary>

**AWS Fargate** is a *serverless* compute engine for containers that works with both Amazon Elastic Container Service (
ECS) and Amazon Elastic Kubernetes Service (EKS). Fargate makes it easy for you to focus on building your applications.
Fargate removes the need to provision and manage servers, lets you specify and pay for resources per application, and
improves security through application isolation by design.

Fargate allocates the right amount of compute, eliminating the need to choose instances and scale cluster capacity. You
only pay for the resources required to run your containers, so there is no over-provisioning and paying for additional
servers. Fargate runs each task or pod in its own kernel providing the tasks and pods their own isolated compute
environment. This enables your application to have workload isolation and improved security by design. This is why
customers such as Vanguard, Accenture, Foursquare, and Ancestry have chosen to run their mission critical applications
on Fargate.

</details>

### TLS Development Key(s) ###

<details>

<summary>
    <strong>
        OpenSSL CLI Instructions
    </strong>
</summary>

<br/>

```bash
#!/bin/bash --posix

#
# A CSR or Certificate Signing request is a block of encoded text that is given to a Certificate Authority
# when applying for an SSL Certificate. It is usually generated on the server where the certificate will be
# installed and contains information that will be included in the certificate such as the organization name,
# common name (domain name), locality, and country. It also contains the public key that will be included in
# the certificate. A private key is usually created at the same time that you create the CSR, making a key pair.
#
# CSRs are generally encoded using ASN.1 according to the PKCS #10 specification.
#

# ... export SUB="/C=US/ST=MN/O=Cloud Technology LLC./CN=localhost/subjectAltName=DNS:*.nexus.cloud-technology.io,DNS:nexus.cloud-technology.io,localhost,0.0.0.0"
# ...
# ... openssl req -x509 -newkey rsa:8192 -nodes -sha256   \
# ...     -days 365 -passin "pass:Development"            \
# ...         -subj "${SUB}" -keyout Development.key      \
# ...             -out Development.pem

# --> Debian & Ubuntu
# ... sudo apt install libnss3-tools --yes

# --> OS Agnostic
cat << "EOF" | tee Development.conf
[ req ]
prompt              = no
default_bits        = 2048
default_keyfile     = Development.pem
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only

# RFC 4514, RFC 4519

[ subject ]
countryName              = US
stateOrProvinceName      = MN
localityName             = Minneapolis
organizationName         = Localhost

# Friendly Name

commonName          = Development Certificate
emailAddress        = development@localhost.com

[ x509_ext ]

subjectKeyIdentifier        = hash
authorityKeyIdentifier      = keyid,issuer
basicConstraints        = CA:FALSE
keyUsage                = digitalSignature, keyEncipherment
subjectAltName          = @alternate_names
nsComment               = "OpenSSL Generated Certificate"

# RFC 5280, Section 4.2.1.12 makes EKU optional

[ req_ext ]

subjectKeyIdentifier        = hash

basicConstraints            = CA:FALSE
keyUsage                    = digitalSignature, keyEncipherment
subjectAltName              = @alternate_names
nsComment                   = "OpenSSL Generated Certificate"

# CA/Browser Baseline Requirements, Appendix (B)(3)(G)

[ alternate_names ]

DNS.1       = localhost
DNS.7       = 127.0.0.1

# IPv6 localhost
# DNS.8     = ::1
EOF

openssl req -config Development.conf -new -x509 -sha256 -newkey rsa:2048 -nodes \
    -days "1024" -keyout "Development.key" -out "Development.crt"

openssl pkcs12 -export -out "Development.pfx" -inkey "Development.key" -in "Development.crt"

# --> MacOS Only
# ... sudo security -v add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain Development.crt

# --> Debian & Ubuntu
# ... pk12util -d "sql:${HOME}/.pki/nssdb" -i Development.pfx
# ... certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n "Development Certificate" -i Development.crt

# Reference
#   - https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate
```

</details>
