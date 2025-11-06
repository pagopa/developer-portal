import requests
import json

def test_lambda_invocation():
    url = "http://localhost:8080/2015-03-31/functions/function/invocations"
    headers = {"Content-Type": "application/json"}
    
    with open("files/event.json", "r") as f:
        payload = json.load(f)
    
    response = requests.post(url, headers=headers, json=payload)
    
    assert response.status_code == 200
