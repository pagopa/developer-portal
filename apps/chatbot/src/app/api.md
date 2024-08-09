POST /queries
{
  "sessionId": string,
  "question": string,
  "queriedAt": string
}

response:
{
  "id": string,
  "sessionId": string,
  "question": string,
  "answer": string,
  "createdAt": string,
  "queriedAt": string
}

---------------------------------------------

GET /healthz

response:
{
  "message": "OK"
}

---------------------------------------------

GET /queries/{id}

response:
{
  "id": string,
  "sessionId": string,
  "question": string,
  "answer": string,
  "createdAt": string,
  "queriedAt": string
}

---------------------------------------------

GET /sessions

response:
[
  {
    "id": string,
    "title": string,
    "createdAt": string
  }
]

---------------------------------------------

POST /sessions

response:
{
  "id": string,
  "title": string,
  "createdAt": string
}

---------------------------------------------

GET /queries?sessionId={sessionId}

response:
[
  {
    "id": string,
    "sessionId": string,
    "question": string,
    "answer": string,
    "createdAt": string,
    "queriedAt": string
  }
]

---------------------------------------------

PATCH /queries/{id}

{
  "badAnswer": boolean
}
