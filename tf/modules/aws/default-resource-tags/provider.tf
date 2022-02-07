provider "aws" {
    default_tags {
        tags = {
            TF = title(var.tf)
            CFN = title(var.cfn)
            Cloud = title(var.cloud)
            Creator = title(var.creator)
            Service = title(var.service)
            Environment = title(var.environment)
            Organization = title(var.organization)
        }
    }

    profile = (var.profile != null) ? var.profile : "default"
    region = var.region
}
