# `cloud-factory` - Construct Utilities #

**A CLI Utility to Manage Software-Defined State**

`cloud-factory` is a commandline application that provides ci-cd capabilities, code extensions, and overall utilities
for cloud-related management and development.

In order to begin, open a `node.js` capable console and then run the following command:

- `npx --yes cloud-factory@latest --help`

Terraform CDKTF Idea: Wrap `git clone` to parse template repository

```python
""" Manage Git repo """

import logging
import os
import platform
import shutil
import subprocess
from pathlib import Path

# import check_output alone so that it can be patched without affecting
# other parts of subprocess.
from subprocess import check_output
from typing import Optional

from samcli.lib.utils import osutils
from samcli.lib.utils.osutils import rmtree_callback

LOG = logging.getLogger(__name__)


class CloneRepoException(Exception):
    """
    Exception class when clone repo fails.
    """


class CloneRepoUnstableStateException(CloneRepoException):
    """
    Exception class when clone repo enters an unstable state.
    """


class GitRepo:
    """
    Class for managing a Git repo, currently it has a clone functionality only
    Attributes
    ----------
    url: str
        The URL of this Git repository, example "https://github.com/aws/aws-sam-cli"
    local_path: Path
        The path of the last local clone of this Git repository. Can be used in conjunction with clone_attempted
        to avoid unnecessary multiple cloning of the repository.
    clone_attempted: bool
        whether an attempt to clone this Git repository took place or not. Can be used in conjunction with local_path
        to avoid unnecessary multiple cloning of the repository
    Methods
    -------
    clone(self, clone_dir: Path, clone_name, replace_existing=False) -> Path:
        creates a local clone of this Git repository. (more details in the method documentation).
    """

    def __init__(self, url: str) -> None:
        self.url: str = url
        self.local_path: Optional[Path] = None
        self.clone_attempted: bool = False

    @staticmethod
    def _ensure_clone_directory_exists(clone_dir: Path) -> None:
        try:
            clone_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
        except OSError as ex:
            LOG.warning("WARN: Unable to create clone directory.", exc_info=ex)
            raise

    @staticmethod
    def _git_executable() -> str:
        if platform.system().lower() == "windows":
            executables = ["git", "git.cmd", "git.exe", "git.bat"]
        else:
            executables = ["git"]

        for executable in executables:
            try:
                subprocess.Popen([executable], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                # No exception. Let's pick this
                return executable
            except OSError as ex:
                LOG.debug("Unable to find executable %s", executable, exc_info=ex)

        raise OSError("Cannot find git, was looking at executables: {}".format(executables))

    def clone(self, clone_dir: Path, clone_name: str, replace_existing: bool = False) -> Path:
        """
        creates a local clone of this Git repository.
        This method is different from the standard Git clone in the following:
        1. It accepts the path to clone into as a clone_dir (the parent directory to clone in) and a clone_name (The
           name of the local folder) instead of accepting the full path (the join of both) in one parameter
        2. It removes the "*.git" files/directories so the clone is not a GitRepo any more
        3. It has the option to replace the local folder(destination) if already exists
        Parameters
        ----------
        clone_dir: Path
            The directory to create the local clone inside
        clone_name: str
            The dirname of the local clone
        replace_existing: bool
            Whether to replace the current local clone directory if already exists or not
        Returns
        -------
            The path of the created local clone
        Raises
        ------
        OSError:
            when file management errors like unable to mkdir, copytree, rmtree ...etc
        CloneRepoException:
            General errors like for example; if an error occurred while running `git clone`
            or if the local_clone already exists and replace_existing is not set
        CloneRepoUnstableStateException:
            when reaching unstable state, for example with replace_existing flag set, unstable state can happen
            if removed the current local clone but failed to copy the new one from the temp location to the destination
        """

        GitRepo._ensure_clone_directory_exists(clone_dir=clone_dir)
        # clone to temp then move to the destination(repo_local_path)
        with osutils.mkdir_temp(ignore_errors=True) as tempdir:
            try:
                temp_path = os.path.normpath(os.path.join(tempdir, clone_name))
                git_executable: str = GitRepo._git_executable()
                LOG.info("\nCloning from %s", self.url)
                check_output(
                    [git_executable, "clone", self.url, clone_name],
                    cwd=tempdir,
                    stderr=subprocess.STDOUT,
                )
                self.local_path = self._persist_local_repo(temp_path, clone_dir, clone_name, replace_existing)
                return self.local_path
            except OSError as ex:
                LOG.warning("WARN: Could not clone repo %s", self.url, exc_info=ex)
                raise
            except subprocess.CalledProcessError as clone_error:
                output = clone_error.output.decode("utf-8")
                if "not found" in output.lower():
                    LOG.warning("WARN: Could not clone repo %s", self.url, exc_info=clone_error)
                raise CloneRepoException(output) from clone_error
            finally:
                self.clone_attempted = True

    @staticmethod
    def _persist_local_repo(temp_path: str, dest_dir: Path, dest_name: str, replace_existing: bool) -> Path:
        dest_path = os.path.normpath(dest_dir.joinpath(dest_name))
        try:
            if Path(dest_path).exists():
                if not replace_existing:
                    raise CloneRepoException(f"Can not clone to {dest_path}, directory already exist")
                LOG.debug("Removing old repo at %s", dest_path)
                shutil.rmtree(dest_path, onerror=rmtree_callback)

            LOG.debug("Copying from %s to %s", temp_path, dest_path)
            # Todo consider not removing the .git files/directories
            shutil.copytree(temp_path, dest_path, ignore=shutil.ignore_patterns("*.git"))
            return Path(dest_path)
        except (OSError, shutil.Error) as ex:
            # UNSTABLE STATE
            # it's difficult to see how this scenario could happen except weird permissions, user will need to debug
            raise CloneRepoUnstableStateException(
                "Unstable state when updating repo. "
                f"Check that you have permissions to create/delete files in {dest_dir} directory "
                "or file an issue at https://github.com/aws/aws-sam-cli/issues"
            ) from ex
```

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

git clone https://github.com/cloud-hybrid/lambda-function-concept.git ./test

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
