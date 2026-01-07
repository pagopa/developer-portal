# update-expire-at Script

This script updates the `expiresAt` attribute for items in a DynamoDB table based on their `createdAt` date, adding 90 days to each item's `createdAt` timestamp.

## Requirements
- Python 3.8+
- boto3
- AWS credentials with access to the target DynamoDB table

## Usage


```sh
python main.py --table <DYNAMODB_TABLE_NAME> --partition-key <PARTITION_KEY> [--sort-key <SORT_KEY>] [--dryrun yes|no]
```


### Parameters
- `--table` (required): The name of the DynamoDB table to update.
- `--partition-key` (required): The name of the partition key attribute for the table.
- `--sort-key` (optional): The name of the sort key attribute for the table, if it exists.
- `--dryrun` (optional): If set to `yes`, the script will only print the items that would be updated, without making any changes. Default is `no` (updates will be performed).


### Examples

Dry run (no updates, with partition and sort key):
```sh
python main.py --table MyDynamoDBTable --partition-key userId --sort-key id --dryrun yes
```

Dry run (no updates, with only partition key):
```sh
python main.py --table MyDynamoDBTable --partition-key userId --dryrun yes
```

Perform updates (with both keys):
```sh
python main.py --table MyDynamoDBTable --partition-key userId --sort-key id --dryrun no
```


## How it works
- Scans the specified DynamoDB table.
- For each item, calculates a new `expiresAt` value as `createdAt + 90 days` (in Unix timestamp format).
- Updates the item with the new `expiresAt` value (unless `--dryrun yes` is specified).

## Notes
- The script expects each item to have a `createdAt` attribute and the specified partition key (and sort key, if provided).
- Errors for missing keys or update failures are logged and processing continues.

## License
MIT
