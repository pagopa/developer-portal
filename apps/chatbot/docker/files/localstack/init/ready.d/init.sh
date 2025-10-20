#!/bin/bash
AWS_REGION=us-east-1
awslocal sqs create-queue --queue-name chatbot-evaluate.fifo --region ${AWS_REGION} --attributes 'FifoQueue=true,ContentBasedDeduplication=true'
