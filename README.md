# `cloud-factory` - Construct Utilities #

**A CLI Utility to Manage Software-Defined State**

`cloud-factory` is a commandline application that provides ci-cd capabilities, code extensions, and overall utilities
for cloud-related management and development.

In order to begin, open a `node.js` capable console and then run the following command:

- `npx --yes cloud-factory@latest --help`

---

## Schemas ##

- https://raw.githubusercontent.com/awslabs/goformation/master/schema/sam.schema.json
- https://raw.githubusercontent.com/awslabs/goformation/master/schema/cloudformation.schema.json
- https://raw.githubusercontent.com/awslabs/goformation/master/schema/cdk.schema.json

## Usage ##

There exists a few different ways to run `cloud-factory`, depending on the context.

- [**Development Usage**](#development-usage)
- [**NPX Global Usage**](#npx-global-usage)
- [**NPM System Usage**](#npm-system-usage)

#### Development Usage ####

While locally developing, the application can be started via the `start` command located in `package.json`:

```bash
# Start
npm run start

# Help
npm run start -- --help

# Environment Sub-Command Example
npm run start -- environment
```

**Note**: a `--` is required between the `run-script` command, and CLI input. This is due to limitations around
`npm`, and parsing input.

### NPX Global Usage ###

`npx` runs against the most recently-published `NPM` package.

```bash
# Start
npx --yes cloud-factory@latest

# Help
npx --yes cloud-factory@latest ? [--] --help

# Environment Sub-Command Example
npx --yes cloud-factory@latest ? [--] environment
```

**Note**: the `--yes` flag is only required to bypass the `install` prompt. Once installed, the `--yes` flag can be
optionally included without prompt.

### NPM System Usage ###

`cloud-factory` can optionally be installed globally to any `npm`-capable system.

First, run `npm install --global cloud-factory`. Then, `cloud-factory` can be used similar to any other installed
executable:

```bash
# Installation
npm install --global cloud-factory@latest
```

```bash
# Start
cloud-factory

# Help
cloud-factory --help

# Environment Sub-Command Example
cloud-factory environment
```

## Example(s) - A Lambda Deployment ##

*The following example deploys a __single__ Lambda function*, but includes, implicitly, the following resources:

- Lambda Function
- A Lambda Layer
- API Gateway
- X-Ray Enablement
- Log-Groups
- SSM Parameter(s)

**Note**, the only requirement would be a Lambda Function, but for the sake of demonstration, the example includes a
Lambda **Layer**, too.

***All other resources are defined dynamically by `cloud-factory`.***

1. Define and create a new directory
    - `mkdir -p example`
    - `cd example`
2. Clone source(s)
    1. **Lambda Function**
        - `git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test-function`
    2. **Lambda Layer**
        - `git clone https://github.com/cloud-hybrid/lambda-layer-concept.git ./library/test-layer`
3. *Define a `factory.json` file*:
    ```json
    {
        "name": "Concept",
        "organization": "Cloud-Vault",
        "environment": "Development"
    }
    ```
    - i.e.
    ```bash
    cat << "EOF" > factory.json
    {
        "name": "Concept",
        "organization": "Cloud-Vault",
        "environment": "Development"
    }
    EOF
    ```
4. Ensure the current directory takes the following shape:
   ```
   example
     ├── factory.json
     ├── test-function
     └── library
         └── test-layer
   ```
5. With the current-working-directory set to `example`, run:
   ```bash
   npx --yes cloud-factory@latest ci-cd initialize --debug
   ```
    - Feel free to omit the `--debug` flag. It's only included for verbosity and understanding
6. Verify that a `distribution` folder was created.
7. Synthesize the state + source code:
   ```
   npx --yes cloud-factory@latest ci-cd synthesize --debug
   ```
8. Deploy the lambda function + layer:
    ```
    npx --yes cloud-factory@latest ci-cd deploy --debug
    ```
9. A hyperlink will be provided upon successful completion. With reference to the example, navigating
    to `https://v41dkt0ik0.execute-api.us-east-2.amazonaws.com/development/test-function` will then provide a JSON
    response body containing information about the package, and the lambda function's layer.

**Synopsis**

```bash
mkdir -p example && cd "${_}"

git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test-function

git clone https://github.com/cloud-hybrid/lambda-layer-concept.git ./library/test-layer

cat << "EOF" > factory.json
{
    "name": "Concept",
    "organization": "Cloud-Vault",
    "environment": "Development"
}
EOF

npx --yes cloud-factory@latest --version

npx cloud-factory ci-cd initialize  --debug
npx cloud-factory ci-cd synthesize  --debug
npx cloud-factory ci-cd deploy      --debug

[[ "${?}" == "0" ]] && echo "Successfully Deployed"
```
