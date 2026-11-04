---
"infrastructure": minor
---

Prevent overlapping ClickHouse tasks during Langfuse deployments by setting deployment maximum/minimum healthy percentages to 100/0 and disabling Availability Zone rebalancing. ClickHouse deployments now stop the existing task before starting its replacement, causing brief downtime.

Enable deployment circuit breakers for ClickHouse, Langfuse web, and Langfuse worker. Automatically roll back failed web and worker deployments, but leave rollback disabled for ClickHouse.
