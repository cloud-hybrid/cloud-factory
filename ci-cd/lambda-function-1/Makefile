SHELL          	:= $(shell command -v bash)

UNAME 			= $(shell uname)

Directory 		= $(shell git rev-parse --show-toplevel)

Branch 	  		= $(shell git rev-parse --abbrev-ref HEAD)
Branches  		= $(shell git for-each-ref --format='%(refname:short)' refs/heads/ | xargs echo)
Remotes   		= $(shell git remote | xargs echo )

Dirty 			= $(shell git diff --shortstat 2> /dev/null | tail -n1 )

Version  		= $(shell [ -f VERSION ] && head VERSION || echo "0.0.0")

Build    		= $(shell git log --oneline | wc -l | sed -e "s/[ \t]*//g")

Major      		= $(shell echo $(Version) | sed "s/^\([0-9]*\).*/\1/")
Minor      		= $(shell echo $(Version) | sed "s/[0-9]*\.\([0-9]*\).*/\1/")
Patch      		= $(shell echo $(Version) | sed "s/[0-9]*\.[0-9]*\.\([0-9]*\).*/\1/")

Major-Upgrade 	= $(shell expr $(Major) + 1).$(Minor).$(Patch)
Minor-Upgrade 	= $(Major).$(shell expr $(Minor) + 1).$(Patch)
Patch-Upgrade 	= $(Major).$(Minor).$(shell expr $(Patch) + 1)

Major-Build-Upgrade 	= $(shell expr $(Major) + 1).$(Minor).$(Patch)-Build-$(Build)
Minor-Build-Upgrade 	= $(Major).$(shell expr $(Minor) + 1).$(Patch)-Build-$(Build)
Patch-Build-Upgrade 	= $(Major).$(Minor).$(shell expr $(Patch) + 1)-Build-$(Build)

Node = $(shell command -v node)

Install = install --production --no-audit --no-fund

Wipe = rm -r -f node_modules

# Packages = example-1 administration get-secret list-secrets
# Folders = $(foreach _, $(Packages), $(Directory)/packages/template-lambda/template/packages/$_)

Default := $(shell echo "Local-Development-Lambda-Stack")

Describe := $(shell aws cloudformation describe-stack-resource --stack-name "$(Default)" --query "StackResourceDetail.PhysicalResourceId" --logical-resource-id "Function" --output "text")

configure:
	@export AWS_DEFAULT_REGION="$(shell aws configure get region)"
	@export AWS_SECRET_ACCESS_KEY="$(shell aws configure get aws_secret_access_key)"
	@export AWS_ACCESS_KEY_ID="$(shell aws configure get aws_access_key_id)"

development:
	@rm -r -f node_modules
	@rm -r -f @dependencies/nodejs/node_modules
	@npm install .
	@mkdir -p @dependencies/nodejs
	@cp -rf node_modules @dependencies/nodejs/node_modules

build:
	@rm -r -f node_modules
	@rm -r -f @dependencies/nodejs/node_modules
	@npm install --production --omit-dev
	@mkdir -p @dependencies/nodejs
	@aws s3 mb "s3://$(shell dd if=/dev/random bs=24 count=1 2>/dev/null | od -An -tx1 | tr -d " \t\n")" >> @dependencies/resources.log
	@cp -rf node_modules @dependencies/nodejs/node_modules

cfn:
	aws cloudformation deploy --stack-name "${1}" \
        --template-file "${2}" --capabilities CAPABILITY_NAMED_IAM

invoke:
	aws lambda invoke --function-name "$(Describe)"
