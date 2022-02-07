[//]: # (<!-- BEGIN_TF_DOCS -->)

[//]: # ([User-Input] | configuration/documentation/overview.md)

# [`aws-organizational-units`](https://github.com/cloud-hybrid) - *Terraform* #

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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |

## Package ##

### Pipeline & Local Input ###

The following variables are required for an autonomous deployment.

##### Example Input File(s) #####

***`terraform.tfvars`*** - **Note**: empty string(s) are required to be populated via the user, or the ci-cd runtime.

```hcl
region = "us-east-2"
```

***`terraform.tfvars.json`*** - **Note**: `null` value(s) are required to be populated via the user, or the ci-cd runtime.

```json
{
  "region": "us-east-2"
}
```

#### Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_region"></a> [region](#input\_region) | AWS Region | `string` | `"us-east-2"` | no |

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
| [aws_organizations_organization.organization](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/organizations_organization) | data source |

#### Modules

No modules.

#### Outputs

| Name | Description |
|------|-------------|
| <a name="output_organization"></a> [organization](#output\_organization) | The Name of the AWS Organization |

#### Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |

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