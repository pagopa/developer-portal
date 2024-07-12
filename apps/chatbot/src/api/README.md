# run in local environment
```
fastapi dev src/api/main.py
```

## curl example
```
curl -X POST http://localhost:8000/queries -H "Content-Type: application/json" -d '{"question": "GPD gestisce già i pagamenti rateali multipli?"}' -i
```
