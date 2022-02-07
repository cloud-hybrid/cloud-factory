[//]: # (<!-- BEGIN_TF_DOCS -->)

[//]: # ([User-Input] | configuration/documentation/overview.md)

# [`default-resource-tags`](https://github.com/cloud-hybrid) - *Terraform* #

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
cfn          = false
cloud        = "AWS"
creator      = "Jacob B. Sanders"
environment  = "Development"
organization = "Cloud Technology"
profile      = ""
region       = "us-east-2"
service      = ""
tf           = true
```

***`terraform.tfvars.json`*** - **Note**: `null` value(s) are required to be populated via the user, or the ci-cd runtime.

```json
{
  "cfn": false,
  "cloud": "AWS",
  "creator": "Jacob B. Sanders",
  "environment": "Development",
  "organization": "Cloud Technology",
  "profile": null,
  "region": "us-east-2",
  "service": null,
  "tf": true
}
```

#### Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_service"></a> [service](#input\_service) | IaC Target Service | `string` | n/a | yes |
| <a name="input_cfn"></a> [cfn](#input\_cfn) | CFN Management or Inclusion (via TF) Tag Indicator | `bool` | `false` | no |
| <a name="input_cloud"></a> [cloud](#input\_cloud) | Target Cloud Provider | `string` | `"AWS"` | no |
| <a name="input_creator"></a> [creator](#input\_creator) | IaC Initiator (Human Identifiable Name) | `string` | `"Jacob B. Sanders"` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Target Deployment Environment | `string` | `"Development"` | no |
| <a name="input_organization"></a> [organization](#input\_organization) | Organizational Alias, Contractor, or Business Unit | `string` | `"Cloud Technology"` | no |
| <a name="input_profile"></a> [profile](#input\_profile) | AWS Default Credentials Profile | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | Cloud Provider Deployment Target Region | `string` | `"us-east-2"` | no |
| <a name="input_tf"></a> [tf](#input\_tf) | Terraform Management Tag Indicator | `bool` | `true` | no |

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
| [aws_default_tags.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/default_tags) | data source |

#### Modules

No modules.

#### Outputs

| Name | Description |
|------|-------------|
| <a name="output_default-resource-tags"></a> [default-resource-tags](#output\_default-resource-tags) | n/a |

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