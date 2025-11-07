#!/bin/bash

aws s3 mb "s3://$CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT"
aws s3 cp ./files/s3/ s3://$CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT/ --recursive
