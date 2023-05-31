## Requirements

The following tools are required to setup and manage a new environment. 

1. [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed.
2. [tfenv](https://github.com/tfutils/tfenv) to mange terraform versions.

## How setup a new environment

To create a new environment you need to make a first `apply` manually. This is why you have to disable the backend that keep a shared state between executions. Comment the `backend "s3" {}` line from `00-main.tf` file:

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

Then execute the command that initialize the env, and finally apply the resources.

```bash
# init the resources for the new dev environment
cd .infrastructure

# Init terraform
./terraform.sh init dev

# Apply the changes
./terraform.sh apply dev
```

Among other things the previous steps creates the following resources:
* An S3 bucket to store the terraform state.
* A DynamoDB table to manage terraform locks.
* The Github OpenId connection

These resources are needed to keep the locks and state of terraform and to allow github workflows to access to them.

Finally remove the comment from the line `backend "s3" {}` from `00-main.tf` file:

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

And update the `env/<env_name>/backend.tfvars` file adding the information required to the backend, you can find the bucket and dynamodb_table as output of the previous apply command. The following is just an example:

``` sh
bucket         = "terraform-backend-20220513123912057800000001"
key            = "dev/main/tfstate"
region         = "eu-south-1"
dynamodb_table = "terraform-lock"
```




``` sh
terraform init \
    -input=false \
    -backend-config="bucket=state.terraform.$TF_VAR_bucket_extension" \
    -backend-config="key=$TF_VAR_resourcetier/$namespace/terraform.tfstate" \
    -backend-config="region=$AWS_DEFAULT_REGION" \
    -backend-config="dynamodb_table=locks.state.terraform.$TF_VAR_bucket_extension"
```
