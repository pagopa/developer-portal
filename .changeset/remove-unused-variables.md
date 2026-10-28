---
"infrastructure": patch
---

Remove unused IVS_CHANNEL_ARN environment variable and webinar_metrics_channel_key parameter from video streaming Terraform module.

The Lambda function webinar_metrics no longer uses the IVS_CHANNEL_ARN environment variable. Clean up unused variables in:
- `apps/infrastructure/src/modules/video_streaming/lambda.tf` - removed IVS_CHANNEL_ARN from environment variables
- `apps/infrastructure/src/modules/video_streaming/variables.tf` - removed webinar_metrics_channel_key variable
- `apps/infrastructure/src/main.tf` - removed webinar_metrics_channel_key parameter
- `apps/infrastructure/src/modules/video_streaming/README.md` - removed variable documentation