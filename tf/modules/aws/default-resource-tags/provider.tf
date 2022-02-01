provider "aws" {
    default_tags {
        tags = {
            tf = var.tf
            cfn = var.cfn
            cloud = var.cloud
            creator = var.creator
            service = var.service
            environment = var.environment
            organization = var.organization
        }
    }

    region = var.region
}
