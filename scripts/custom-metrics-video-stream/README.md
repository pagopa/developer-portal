# Custom Metrics Video Stream Simulator

This script simulates webinar viewer metrics by sending custom metrics to AWS CloudWatch.

## Overview

The `simulate_webinar_metrics.py` script sends periodic metrics to CloudWatch that track active viewers for multiple webinar sessions. It's designed for testing and demonstration purposes.

## How It Works

1. **Metric Generation**: The script sends a constant value of `1` for each webinar to CloudWatch
2. **Multiple Webinars**: Tracks two webinar IDs simultaneously (`WEBINAR_123` and `WEBINAR_456`)
3. **Random Intervals**: Sends metrics at random intervals between 1 and 6 seconds
4. **Duration**: Runs for a configurable duration (default: 1 hour)

## Configuration

Key configuration variables in the script:

- `NAMESPACE`: CloudWatch namespace (`WebinarAppTest`)
- `METRIC_NAME`: Name of the metric (`ActiveViewers`)
- `WEBINAR_IDS`: List of webinar IDs to track
- `DURATION_HOURS`: How long to run the simulation (default: 1 hour)

## Prerequisites

- Python 3.x
- AWS credentials configured (via AWS CLI, environment variables, or IAM role)
- Required Python packages:
  ```bash
  pip install boto3
  ```

## Usage

Run the script:

```bash
python simulate_webinar_metrics.py
```

The script will:
- Connect to AWS CloudWatch in the `eu-central-1` region
- Send metrics for both webinar IDs at random intervals
- Print timestamped output showing the values sent
- Continue until the duration elapses or you press Ctrl+C

## Output Example

```
Starting simulation for 1 hour(s)...
[14:23:45] Sent: WEBINAR_123=1, WEBINAR_456=1
[14:23:48] Sent: WEBINAR_123=1, WEBINAR_456=1
[14:23:52] Sent: WEBINAR_123=1, WEBINAR_456=1
```

## Stopping the Script

Press `Ctrl+C` to stop the simulation gracefully.

## AWS Permissions Required

The AWS credentials used must have the following CloudWatch permission:
- `cloudwatch:PutMetricData`
