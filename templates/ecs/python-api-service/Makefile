SHELL          	:= $(shell command -v bash)
VENV			:= "${PWD}/.venv"

clean:
	@find . -type f -name "*.whl" -exec rm -rf {} \;

tools: clean
	@python3 -m pip install --upgrade pip setuptools wheel

dependencies: tools
	@python3 -m pip install --requirement requirements.txt

build: dependencies
	@python3 setup.py build

install: build
	@python3 -m pip install --force --upgrade .

release: install
	@python3 setup.py release

wheels:
	@find ./artifacts -type f -name "*.whl" -exec echo {} \;

wheel:
	@python3 setup.py bdist_wheel
	@find ./artifacts -type f -name "*.whl" -exec cp {} . \;

wheel-install: wheel
	@python3 -m pip install *.whl --force-reinstall

container:
	@docker build --tag python-api-service:latest . --file Dockerfile

start-container:
	docker run --publish 3000:3000 python-api-service:latest
