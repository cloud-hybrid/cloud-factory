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

Packages = example-1 administration get-secret list-secrets
Folders = $(foreach _, $(Packages), $(Directory)/packages/template-lambda/template/packages/$_)

synth:
	@cd - && npm install
	@cd - && npm run get
	@cd - && npm run build
	@cd - && npm run synth

clean:
	$(foreach Target, $(Folders), ( cd $(Target) && $(Wipe) || sudo $(Wipe) || true ) ; )

install: clean
	$(foreach Target, $(Folders), ( cd $(Target) && npm $(Install) ) ; )

build: install
	@sam build --config-file configuration.toml

package: build
	@sam package --config-file configuration.toml

deploy: package
	@sam deploy --config-file configuration.toml

delete:
	@sam delete --config-file configuration.toml --no-prompts

overwrite:
	@sam package --config-file configuration.toml
	@sam deploy --config-file configuration.toml
