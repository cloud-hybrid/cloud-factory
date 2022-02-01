provider "aws" {
    region = "us-east-2"
}

module "account" {
    source = "../../modules/aws/account-iam-settings"

    alias = "Cloud-Technology"
    password-policy = true
}
