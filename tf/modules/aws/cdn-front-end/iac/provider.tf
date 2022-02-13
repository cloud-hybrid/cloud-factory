provider "aws" {
    profile = var.profile
    region  = var.region

    default_tags {
        tags = {
            Organization : title(var.organization)
            Application: title(var.application)
            Environment : title(var.environment)
            Service : title(var.service)
            Creator : var.creator
            Cloud : var.cloud
            CFN: "False"
            TF : "True"
        }
    }
}

provider "aws" {
    alias = "global"

    profile = var.profile
    region  = "us-east-1"

    default_tags {
        tags = {
            Organization : title(var.organization)
            Application: title(var.application)
            Environment : title(var.environment)
            Service : title(var.service)
            Creator : var.creator
            Cloud : var.cloud
            CFN: "False"
            TF : "True"
        }
    }
}

// provider "aws" {
//     alias = "production"
//
//     secret_key = var.production-secret-key
//     access_key = var.production-access-key-id
//
//     region  = var.region
//
//     default_tags {
//         tags = {
//             Organization : title(var.organization)
//             Application: title(var.application)
//             Environment : title(var.environment)
//             Service : title(var.service)
//             Creator : var.creator
//             Cloud : var.cloud
//             CFN: "False"
//             TF : "True"
//         }
//     }
// }

// provider "aws" {
//     alias = "global-production"
//
//     secret_key = var.production-secret-key
//     access_key = var.production-access-key-id
//
//     region  = "us-east-1"
//
//     default_tags {
//         tags = {
//             Organization : title(var.organization)
//             Application: title(var.application)
//             Environment : title(var.environment)
//             Service : title(var.service)
//             Creator : var.creator
//             Cloud : var.cloud
//             CFN: "False"
//             TF : "True"
//         }
//     }
// }

provider "null" {}
provider "archive" {}
provider "local" {}