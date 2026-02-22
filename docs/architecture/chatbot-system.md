# Chatbot System Architecture

```mermaid
flowchart LR
    %% Components
    subgraph Frontend
        NextJS[Next.js Website]
    end

    subgraph AWS_Lambdas [AWS Lambdas]
        Chatbot[Lambda: chatbot]
        Monitor[Lambda: chatbot-monitor]
        Evaluate[Lambda: chatbot-evaluate]
    end

    subgraph SQS
        QueueMonitor[SQS FIFO Queue: dp-chatbot-monitor-queue]
        QueueEvaluate[SQS FIFO Queue: dp-chatbot-evaluate-queue]
    end

    subgraph ECS
        Langfuse[Langfuse - ECS Service]
    end

    %% Main Flow
    NextJS -->|User Query| Chatbot
    Chatbot -->|Response| NextJS

    %% Async Processing - Monitor-Evaluate Chain
    Chatbot -.->|async: create_trace<br/>+should_evaluate flag| QueueMonitor
    
    QueueMonitor --> Monitor
    Monitor -->|Creates trace| Langfuse
    Monitor -.->|If should_evaluate<br/>enqueue evaluation| QueueEvaluate
    
    QueueEvaluate --> Evaluate
    Evaluate -.->|add_scores| QueueMonitor
    
    Monitor -->|Adds scores to trace| Langfuse

    %% Styling
    style Chatbot fill:#f3e5f5
    style Monitor fill:#f3e5f5
    style Evaluate fill:#f3e5f5
    style QueueMonitor fill:#fff9c4
    style QueueEvaluate fill:#fff9c4
    style Langfuse fill:#e8f5e9
```

## Architecture Notes

### Monitor-Evaluate Chain
- **Chatbot** sends trace creation messages to **Monitor Queue** only
- **Monitor Lambda** creates traces in Langfuse and conditionally enqueues evaluation
- **Evaluate Lambda** processes evaluations (10-30s) and sends scores back to Monitor Queue
- **Monitor Lambda** receives scores and adds them to existing traces

### Benefits
- ✅ No race conditions - trace exists before scores are added
- ✅ Fast monitor lambda - creates trace in 1-2s
- ✅ Separation of concerns - each lambda has one responsibility
- ✅ Conditional evaluation - only evaluates when needed

### Queue Naming
- Use FIFO queues (`.fifo` suffix) for message ordering
- Environment-specific naming: `dp-chatbot-{queue-name}-{env}.fifo`
- Examples: `dp-chatbot-monitor-queue-dev.fifo`, `dp-chatbot-evaluate-queue-prod.fifo`
