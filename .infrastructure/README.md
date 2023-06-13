## Requirements

The following tools are required to setup and manage a new environment. 

1. [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed.
2. [tfenv](https://github.com/tfutils/tfenv) to mange terraform versions.

## How setup a new environment

Make sure you don't have a `*.tfstate` file within the `.infrastructure/.terraform` folder. If you have any, delete them.

### Step 1: Disable the backend

Comment the `backend "s3" {}` line from `00-main.tf` file:

``` sh
terraform {
  required_version = "1.2.8"

  # v------- this line!
  # backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.67.0"
    }
  }
}
```

### Step 2: Create IaC resources

The following steps require a valid aws session

``` sh
cd .infrastructure

# create an empty terraform vars file
touch env/<env_name>/terraform.tfvars

# install dependencies
./terraform.sh init <env_name>

# plan to see what is created for the environment <env_name>
./terraform.sh plan <env_name> -target module.identity

# apply to create the resources required for environment <env_name>
./terraform.sh apply <env_name> -target module.identity
```

Among other things the previous steps creates the following resources:
* An S3 bucket to store the terraform state.
* A DynamoDB table to manage terraform locks.
* The Github OpenId connection

These resources are needed to keep the locks and state of terraform and to allow github workflows to access to them.

Copy the output provided by terraform, you need the following two outputs: 
* `terraform_backend_bucket_name`
* `terraform_lock_dynamodb_table`

### Step 3: Add the backend and upload the local state

Remove the comment from the line `backend "s3" {}` from `00-main.tf` file:

``` sh
terraform {
  required_version = "1.2.8"

  # v------- this line!
  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.67.0"
    }
  }
}
```

Write into the file `env/<env_name>/backend.tfvars` the following content replacing the keys with the valid values:

``` sh
bucket         = "<put_here_the_terraform_backend_bucket_name>"
key            = "<env_name>/main/tfstate"
region         = "eu-south-1"
dynamodb_table = "<put_here_the_terraform_lock_dynamodb_table>"
```

And finally execute the following command that upload state to S3. Reply yes to the question:

``` sh
# you will ask to push the existing state to S3 bucket
 ./terraform.sh init <env_name>
```

### Step 4: Add the IAM role as GitHub environment secret

In order to allow github to manage the aws resources you have to add the `IAM_ROLE` environment secret filled with the `arn` of `GitHubActionIACRole` role. Find the `arn` of the role via management console. 
