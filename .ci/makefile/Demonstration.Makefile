SHELL          	= $(shell command -v bash)

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

directory:
	@mkdir -p example && cd ./example
	@mkdir -p library

function:
    @git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test-function

layer:
	@git clone https://github.com/cloud-hybrid/lambda-layer-concept.git ./library/test-layer

configuration:
	@echo '{"name": "Concept", "organization": "Cloud-Vault", "environment": "Development"}' | jq . > factory.json

install:
	@npx --yes cloud-factory@latest --version

pipeline:
	@npx cloud-factory ci-cd initialize  --debug
	@npx cloud-factory ci-cd synthesize  --debug
	@npx cloud-factory ci-cd deploy      --debug

destroy:
	@cd distribution && cdktf destroy
