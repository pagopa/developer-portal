## Requirements

The following tools are required to init a new environment. 

1. [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed.
2. [tfenv](https://github.com/tfutils/tfenv) to mange terraform versions.

## Create the resources required to setup a new IaC environment

The `init` folder contains the resources required for a new IaC environment:
* An S3 bucket to store the terraform state.
* A DynamoDB table to manage terraform locks.
* The Github OpenId connection

```bash
# init the resources required for the dev IaC environment
cd src/init

# Init
./terraform.sh init dev
# Apply the changes
./terraform.sh apply dev
```
