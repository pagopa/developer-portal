mock_provider "aws" {}

run "plan_cms_with_unknown_arn" {
  command = plan

  module {
    source = "./tests/fixtures/unknown_arns"
  }

  variables {
    include_langfuse = false
  }
}

run "plan_cms_and_langfuse_with_unknown_arns" {
  command = plan

  module {
    source = "./tests/fixtures/unknown_arns"
  }

  variables {
    include_langfuse = true
  }
}
