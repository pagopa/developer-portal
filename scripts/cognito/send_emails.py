import csv
import random
import quopri
import sys

import boto3
from botocore.exceptions import ClientError

AWS_REGION = "eu-south-1"
SENDER = "noreply@dev.developer.pagopa.it"
SUBJECT = "Verifica la tua e-mail - PagoPA DevPortal"
CHARSET = "UTF-8"

CSV_FILE = "unconfirmed_eu-south-1_8DFWF1fRa_20260319.csv"
HTML_TEMPLATE_FILE = "email-template.html"


def load_html_template(path: str) -> str:
    with open(path, "rb") as f:
        raw = f.read()
    # The template is quoted-printable encoded; decode it
    return quopri.decodestring(raw).decode("utf-8")


def build_html_body(template: str, username: str, code: str) -> str:
    return template.replace("{{username}}", username).replace("{{code}}", code)


def generate_code() -> str:
    #return str(random.randint(100000, 999999))
    return "142670"


def send_email(ses_client, recipient: str, html_body: str) -> dict:
    return ses_client.send_email(
        Source=SENDER,
        Destination={"ToAddresses": [recipient]},
        Message={
            "Subject": {"Charset": CHARSET, "Data": SUBJECT},
            "Body": {"Html": {"Charset": CHARSET, "Data": html_body}},
        },
    )


def main():
    template = load_html_template(HTML_TEMPLATE_FILE)
    ses_client = boto3.client("ses", region_name=AWS_REGION)

    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header

        for row in reader:
            username = row[0]
            email = row[1]
            code = generate_code()
            html_body = build_html_body(template, username, code)

            try:
                response = send_email(ses_client, email, html_body)
                message_id = response["MessageId"]
                print(f"OK  {email} (username={username}, code={code}, id={message_id})")
            except ClientError as e:
                error_msg = e.response["Error"]["Message"]
                print(f"ERR {email} (username={username}): {error_msg}", file=sys.stderr)


if __name__ == "__main__":
    main()
