import json
import os
import time
import boto3

ATHENA_DATABASE = os.environ.get("ATHENA_DATABASE", "webinar_analytics")
ATHENA_OUTPUT_LOCATION = os.environ["ATHENA_OUTPUT_LOCATION"]
ATHENA_WORKGROUP = os.environ.get("ATHENA_WORKGROUP", "primary")
POLL_INTERVAL_SECONDS = int(os.environ.get("POLL_INTERVAL_SECONDS", "2"))
MAX_WAIT_SECONDS = int(os.environ.get("MAX_WAIT_SECONDS", "60"))

SQL_FILE = os.path.join(os.path.dirname(__file__), "athena", "search-certificates-by-user.sql")


def _load_query(user_id: str) -> str:
    with open(SQL_FILE, "r") as f:
        sql = f.read()
    return sql.replace("<USER_ID>", user_id.replace("'", "''"))


def _run_query(athena_client, query: str) -> str:
    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={"Database": ATHENA_DATABASE},
        ResultConfiguration={"OutputLocation": ATHENA_OUTPUT_LOCATION},
        WorkGroup=ATHENA_WORKGROUP,
    )
    return response["QueryExecutionId"]


def _wait_for_query(athena_client, execution_id: str) -> None:
    elapsed = 0
    terminal_states = {"SUCCEEDED", "FAILED", "CANCELLED"}
    while elapsed < MAX_WAIT_SECONDS:
        result = athena_client.get_query_execution(QueryExecutionId=execution_id)
        state = result["QueryExecution"]["Status"]["State"]
        if state in terminal_states:
            if state != "SUCCEEDED":
                reason = result["QueryExecution"]["Status"].get("StateChangeReason", "")
                raise RuntimeError(f"Athena query {state}: {reason}")
            return
        time.sleep(POLL_INTERVAL_SECONDS)
        elapsed += POLL_INTERVAL_SECONDS
    raise TimeoutError(f"Athena query did not complete within {MAX_WAIT_SECONDS}s")


def _fetch_results(athena_client, execution_id: str) -> list[str]:
    webinar_ids: list[str] = []
    paginator = athena_client.get_paginator("get_query_results")
    first_page = True
    for page in paginator.paginate(QueryExecutionId=execution_id):
        rows = page["ResultSet"]["Rows"]
        # skip header row on the first page
        start = 1 if first_page else 0
        first_page = False
        for row in rows[start:]:
            # webinarid is the first column in the SELECT
            value = row["Data"][0].get("VarCharValue", "")
            if value:
                webinar_ids.append(value)
    return webinar_ids


def handler(event: dict, context) -> dict:
    """
    Lambda entry point.

    Expected input:
        { "userId": "<user_id>" }

    Returns:
        {
            "statusCode": 200,
            "body": '["webinar-1", "webinar-2", ...]'
        }
    """
    user_id = event.get("userId") or event.get("user_id")
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing required parameter: userId"}),
        }

    athena = boto3.client("athena")
    query = _load_query(str(user_id))

    execution_id = _run_query(athena, query)
    _wait_for_query(athena, execution_id)
    webinar_ids = _fetch_results(athena, execution_id)

    return {
        "statusCode": 200,
        "body": json.dumps(webinar_ids),
    }
