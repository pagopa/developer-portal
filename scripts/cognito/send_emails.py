import csv
import sys

import boto3
from botocore.exceptions import ClientError

AWS_REGION = "eu-south-1"
CLIENT_ID = "1in3b9uma6kss8aea4hohtuls5"

CSV_FILE = "unconfirmed_eu-south-1_8DFWF1fRa_20260319.csv"


def resend_confirmation_code(cognito_client, username: str) -> dict:
    """Triggers Cognito to generate a new confirmation code and send the
    confirmation email via the Custom Message Lambda trigger."""
    return cognito_client.resend_confirmation_code(
        ClientId=CLIENT_ID,
        Username=username,
    )


def main():
    cognito_client = boto3.client("cognito-idp", region_name=AWS_REGION)

    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header

        for row in reader:
            username = row[0]
            email = row[1]

            try:
                response = resend_confirmation_code(cognito_client, email)
                delivery = response["CodeDeliveryDetails"]
                print(
                    f"OK  {email} (username={username}, "
                    f"delivery={delivery['DeliveryMedium']} to {delivery['Destination']})"
                )
            except ClientError as e:
                error_msg = e.response["Error"]["Message"]
                print(f"ERR {email} (username={username}): {error_msg}", file=sys.stderr)


if __name__ == "__main__":
    main()
