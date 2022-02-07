[//]: # (<!-- BEGIN_TF_DOCS -->)

[//]: # ([User-Input] | configuration/documentation/overview.md)

# [`account-settings`](https://github.com/cloud-hybrid) - *Terraform* #

*Infrastructure as Code*

## Table of Contents ##

[[_TOC_]]

---

## Overview ##

[//]: # ([User-Input] | configuration/documentation/overview.md)

**::: --- Boilerplate --- :::**

---

## IaC ##

### Setup & Runtime ###

The following package(s) & Terraform provider(s) are required
in order to manage the following infrastructure.

#### Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 3.0 |

## Package ##

### Pipeline & Local Input ###

The following variables are required for an autonomous deployment.

##### Example Input File(s) #####

***`terraform.tfvars`*** - **Note**: empty string(s) are required to be populated via the user, or the ci-cd runtime.

```hcl
alias              = "Cloud-Technology"
allow-user-updates = true
expiration         = false
identity           = true
lowercase          = true
max-age            = 0
minimum-length     = 8
numbers            = true
password-policy    = true
prevent-reuse      = true
special-characters = true
uppercase          = true
```

***`terraform.tfvars.json`*** - **Note**: `null` value(s) are required to be populated via the user, or the ci-cd runtime.

```json
{
  "alias": "Cloud-Technology",
  "allow-user-updates": true,
  "expiration": false,
  "identity": true,
  "lowercase": true,
  "max-age": 0,
  "minimum-length": 8,
  "numbers": true,
  "password-policy": true,
  "prevent-reuse": true,
  "special-characters": true,
  "uppercase": true
}
```

#### Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_alias"></a> [alias](#input\_alias) | AWS IAM Account Alias for Account | `string` | `"Cloud-Technology"` | no |
| <a name="input_allow-user-updates"></a> [allow-user-updates](#input\_allow-user-updates) | Allow User Password Change(s) | `bool` | `true` | no |
| <a name="input_expiration"></a> [expiration](#input\_expiration) | Enforce Password Expiration | `bool` | `false` | no |
| <a name="input_identity"></a> [identity](#input\_identity) | Whether to get AWS account ID, User ID, and ARN in which Terraform is Authorized | `bool` | `true` | no |
| <a name="input_lowercase"></a> [lowercase](#input\_lowercase) | Enforce Lowercase Letter(s) in Password Policy | `bool` | `true` | no |
| <a name="input_max-age"></a> [max-age](#input\_max-age) | Max-Password Age - 0 Disables Max-Password Age | `number` | `0` | no |
| <a name="input_minimum-length"></a> [minimum-length](#input\_minimum-length) | Minimum Password Length - 0 Disables Minimum Length | `number` | `8` | no |
| <a name="input_numbers"></a> [numbers](#input\_numbers) | Enforce Number(s) in Password Policy | `bool` | `true` | no |
| <a name="input_password-policy"></a> [password-policy](#input\_password-policy) | Enforce Account-Wide Password Policy | `bool` | `true` | no |
| <a name="input_prevent-reuse"></a> [prevent-reuse](#input\_prevent-reuse) | Enforce Password Reuse Prevention | `bool` | `true` | no |
| <a name="input_special-characters"></a> [special-characters](#input\_special-characters) | Enforce Special Character(s) in Password Policy | `bool` | `true` | no |
| <a name="input_uppercase"></a> [uppercase](#input\_uppercase) | Enforce Uppercase Letter(s) in Password Policy | `bool` | `true` | no |

Additionally, please note that **only the `terraform.tfvars` file is automatically searched for**; if `terraform.tfvars.json`
-- or any arbitrary `*.json` file -- is instead the target input file, then the `--var-file` flag needs to be
included.

With the required variables defined via `terraform.tfvars`, execute a `terraform`
related command(s) via:

```bash
terraform validate
terraform plan --out "local-state"
terraform apply --state "local-state" --state-out "local-state.archive"
```

or via a `terraform.tfvars.json` (or another type of `*.json` file) ...

```bash
terraform validate --json
terraform plan --out "local-state" --var-file "terraform.tfvars.json"
terraform apply --state "local-state" --state-out "local-state.archive" --var-file "terraform.tfvars.json"
```

---

#### Resources

| Name | Type |
|------|------|
| [aws_iam_account_alias.account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_account_alias) | resource |
| [aws_iam_account_password_policy.account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_account_password_policy) | resource |
| [aws_caller_identity.account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

#### Modules

No modules.

#### Outputs

| Name | Description |
|------|-------------|
| <a name="output_aws-account-alias"></a> [aws-account-alias](#output\_aws-account-alias) | AWS Account Login Alias |
| <a name="output_caller-identity-account-id"></a> [caller-identity-account-id](#output\_caller-identity-account-id) | The AWS Account ID number of the Account that Owns or Contains the Invocation's Entity |
| <a name="output_caller-identity-arn"></a> [caller-identity-arn](#output\_caller-identity-arn) | The AWS ARN Associated with the Invocation's Entity |
| <a name="output_caller-identity-user-id"></a> [caller-identity-user-id](#output\_caller-identity-user-id) | The Unique Identifier of the Invocation's Entity |
| <a name="output_iam-account-password-policy"></a> [iam-account-password-policy](#output\_iam-account-password-policy) | AWS Account Password Policy |
| <a name="output_iam-account-password-policy-expire-passwords"></a> [iam-account-password-policy-expire-passwords](#output\_iam-account-password-policy-expire-passwords) | Indicates Account-Wide Password Expiration Policy |

#### Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | ~> 3.0 |

---

[//]: # ([Static] | configuration/documentation/footer.md)

## Auto-Generating Documentation ##

In order to successfully generate `terraform` documentation, the following steps need to be
performed in order:

1. `brew install terraform-docs` - Install Documentation Dependency
2. `terraform init` - Initialize Terraform Local Requirements
3. `eval "${PWD}/ci-cd/tfvars"` - Generate the `terraform.tfvars` & `terraform.tfvars.json` Files
4. `eval "${PWD}/ci-cd/inject"` - Inject `README.md` via Configuration Settings + `*.md` Files

Lastly, Commit & Push to VCS.


[//]: # (<!-- END_TF_DOCS -->)