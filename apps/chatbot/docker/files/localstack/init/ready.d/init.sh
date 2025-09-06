#!/bin/bash
awslocal sqs create-queue --queue-name chatbot-evaluate.fifo --region eu-south-1 --attributes 'FifoQueue=true,ContentBasedDeduplication=true'
