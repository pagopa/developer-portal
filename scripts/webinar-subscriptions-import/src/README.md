# Webinar Subscriptions Importer

This script fetches users subscriptions to webinars from Amazon Cognito based on the specified environment (dev or prod) and saves the data to DynamoDB. The script is idempotent, so it can be run incrementally at any time without data disruption.

## Running the Script

To run the script, follow these steps:

1. Ensure you have Python installed on your system. You can download it from [python.org](https://www.python.org/).

2. Navigate to the project directory:

```cd scripts/webinar-subscriptions-import```

3. Install the necessary dependencies:

```pip3 install -r requirements.txt```

4. Execute the script by running the following command:

```python3 src/main.py [dev/prod]```

## Running Tests

We use pytest for testing. To run the tests, follow these steps:

1. Navigate to the project directory:

```cd scripts/```

2. Make sure you have pytest and the other dev requirements installed. If not, you can install them using pip:

```pip3 install -r dev-requirements.txt```

3. Run pytest by executing the following command:

```pytest```

This will run all the tests in the project.