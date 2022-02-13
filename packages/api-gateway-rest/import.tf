provider "aws" {
    region = "us-east-2"
}

locals {
    resources = [
        {
            "id": "49m77l",
            "parentId": "rxye8sk4x9",
            "pathPart": "building",
            "path": "/building",
            "resourceMethods": {
                "GET": {},
                "OPTIONS": {}
            }
        },
        {
            "id": "8p3677",
            "parentId": "srg7e1",
            "pathPart": "payload",
            "path": "/log/payload",
            "resourceMethods": {
                "OPTIONS": {},
                "POST": {}
            }
        },
        {
            "id": "9c0g23",
            "parentId": "rxye8sk4x9",
            "pathPart": "alternate",
            "path": "/alternate"
        },
        {
            "id": "cgl48e",
            "parentId": "ug82u7",
            "pathPart": "cookie",
            "path": "/auth/cookie",
            "resourceMethods": {
                "OPTIONS": {},
                "POST": {}
            }
        },
        {
            "id": "dmj2qp",
            "parentId": "f38vf7",
            "pathPart": "check",
            "path": "/eula/check",
            "resourceMethods": {
                "OPTIONS": {},
                "POST": {}
            }
        },
        {
            "id": "f38vf7",
            "parentId": "rxye8sk4x9",
            "pathPart": "eula",
            "path": "/eula"
        },
        {
            "id": "fyzqnr",
            "parentId": "v4mdev",
            "pathPart": "all",
            "path": "/district/building/all",
            "resourceMethods": {
                "GET": {},
                "OPTIONS": {}
            }
        },
        {
            "id": "mtdr8c",
            "parentId": "rwjl3g",
            "pathPart": "all",
            "path": "/user/all",
            "resourceMethods": {
                "GET": {},
                "OPTIONS": {}
            }
        },
        {
            "id": "o1gz1f",
            "parentId": "f38vf7",
            "pathPart": "accept",
            "path": "/eula/accept",
            "resourceMethods": {
                "OPTIONS": {},
                "POST": {}
            }
        },
        {
            "id": "qejgdu",
            "parentId": "9c0g23",
            "pathPart": "{article_id}",
            "path": "/alternate/{article_id}",
            "resourceMethods": {
                "GET": {},
                "OPTIONS": {}
            }
        },
        {
            "id": "rwjl3g",
            "parentId": "rxye8sk4x9",
            "pathPart": "user",
            "path": "/user",
            "resourceMethods": {
                "OPTIONS": {},
                "POST": {}
            }
        },
        {
            "id": "rxye8sk4x9",
            "path": "/"
        },
        {
            "id": "srg7e1",
            "parentId": "rxye8sk4x9",
            "pathPart": "log",
            "path": "/log"
        },
        {
            "id": "ug82u7",
            "parentId": "rxye8sk4x9",
            "pathPart": "auth",
            "path": "/auth"
        },
        {
            "id": "v4mdev",
            "parentId": "vz0nks",
            "pathPart": "building",
            "path": "/district/building"
        },
        {
            "id": "vz0nks",
            "parentId": "rxye8sk4x9",
            "pathPart": "district",
            "path": "/district"
        }
    ]
}

resource "aws_api_gateway_rest_api" "api-gateway" {
    name = "user_service_qa"
    api_key_source = "HEADER"
    description = "User Service API Gateway"
    disable_execute_api_endpoint = false
    endpoint_configuration {
        types = [ "REGIONAL" ]
    }
    minimum_compression_size = -1
}
