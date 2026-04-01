# Cognito Unconfirmed User Exporter
A lightweight Python utility to filter and export AWS Cognito users who are in the UNCONFIRMED status within a specific historical date range (March 5th – March 12th, 2026).

## Features
Status Filtering: Specifically targets UNCONFIRMED users to help with cleanup or re-engagement.

Date Range Logic: Filters users created between 2026-03-05 00:00:01 and 2026-03-12 23:59:59 (UTC).

Attribute Parsing: Automatically extracts the email attribute from the Cognito attribute list.

CSV Export: Saves results to a CSV file named with the User Pool ID and current date.

Pagination Support: Uses Boto3 paginators to handle large user pools without hitting API limits.

## Prerequisites
Python 3.9+

AWS CLI configured with appropriate permissions.

Boto3 library installed.

```bash
pip install boto3
```

## Required IAM Permissions
The credentials used must have the following permission:

cognito-idp:ListUsers

## Usage
Run the script from your terminal by providing the User Pool ID as a positional argument.

Basic Command

```bash
python cognito_export.py <your_user_pool_id>
```

Specify a Region
By default, the script looks in us-east-1. If your pool is elsewhere, use the --region flag:

```bash
python cognito_export.py us-west-2_abc12345 --region us-west-2
```

Help

```bash
python cognito_export.py --help
```
Output
The script generates a CSV file in the current working directory with the following columns:

- Username
- Email
- CreatedDate (Formatted as YYYY-MM-DD HH:MM:SS)
- Status

Filename format: unconfirmed_<user_pool_id>_<YYYYMMDD>.csv

Note: This CSV contains email addresses and other potentially sensitive data. Handle it securely, avoid committing it to version control, and consider adding an ignore rule such as:

```gitignore
unconfirmed_*.csv
```