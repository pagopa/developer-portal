import json
import os
import time
import boto3

ATHENA_DATABASE = os.environ.get("ATHENA_DATABASE", "webinar_analytics")
ATHENA_OUTPUT_LOCATION = os.environ["ATHENA_OUTPUT_LOCATION"]
ATHENA_WORKGROUP = os.environ.get("ATHENA_WORKGROUP", "primary")
POLL_INTERVAL_SECONDS = float(os.environ.get("POLL_INTERVAL_SECONDS", "0.2"))
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


def _fetch_results(athena_client, execution_id: str) -> list[dict[str, str | None]]:
    webinars: list[dict[str, str | None]] = []
    paginator = athena_client.get_paginator("get_query_results")
    first_page = True
    for page in paginator.paginate(QueryExecutionId=execution_id):
        result_set = page["ResultSet"]
        columns = [
            column["Name"]
            for column in result_set["ResultSetMetadata"]["ColumnInfo"]
        ]
        rows = result_set["Rows"]
        # skip header row on the first page
        start = 1 if first_page else 0
        first_page = False
        for row in rows[start:]:
            data = row["Data"]
            webinars.append(
                {
                    column: data[index].get("VarCharValue")
                    if index < len(data)
                    else None
                    for index, column in enumerate(columns)
                }
            )
    return webinars


def handler(event: dict, context) -> dict:
    """
    Lambda entry point.

    Authentication:
        Intended for API Gateway HTTP API (payload v2.0) with a JWT authorizer.
        The user identity is taken from JWT claims.

    Returns:
        {
            "statusCode": 200,
            "body": '[{"webinarid": "webinar-1",
                       "minutes_spent_watching": "10.98",
                       "webinar_duration_minutes": "10.0",
                       "watch_percentage": "109.8",
                       "reached_80_percent_at": "2026-08-25 08:33:30.473 UTC",
                       "last_viewed_at": "2026-08-25 08:35:31.289 UTC"}, ...]'
        }

        Column names and string values match the Athena CSV output.
        SQL NULL values are represented as JSON null.
    """
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )
    user_id = claims.get("sub") or claims.get("cognito:username") or claims.get("username")
    if not user_id:
        return {
            "statusCode": 401,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Unauthorized: missing user identity"}),
        }

    athena = boto3.client("athena")
    query = _load_query(str(user_id))

    execution_id = _run_query(athena, query)
    _wait_for_query(athena, execution_id)
    webinars = _fetch_results(athena, execution_id)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(webinars),
    }
