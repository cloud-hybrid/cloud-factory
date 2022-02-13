[//]: # ([Static])

## Auto-Generating Documentation ##

In order to successfully generate `terraform` documentation, the following steps need to be
performed in order:

1. `brew install terraform-docs` - Install Documentation Dependency
2. `terraform init` - Initialize Terraform Local Requirements
4. `eval "${PWD}/ci-cd/inject"` - Generate Variable(s) & Inject `README.md` 

Lastly, Commit & Push to VCS.
