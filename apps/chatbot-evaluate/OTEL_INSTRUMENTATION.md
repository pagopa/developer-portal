# OpenTelemetry Instrumentation

This Lambda function is instrumented with OpenTelemetry to trace performance and identify heavy operations.

## What's Instrumented

The following operations are traced:

### 1. **Initialization (Cold Start)**
- `judge_initialization` - Total time to initialize the Judge
  - `judge_init` - Judge class initialization
    - `load_settings` - Loading settings
    - `get_llm` - Loading the LLM model
      - `import_google_genai` - Importing Google GenAI library
      - `instantiate_google_llm` - Creating LLM instance
    - `create_evaluator` - Creating evaluator
      - `get_embed_model` - Loading embedding model
        - `import_google_genai_embedding` - Importing embedding library
        - `instantiate_google_embedding` - Creating embedding instance
      - `instantiate_evaluator` - Creating evaluator instance
        - `evaluator_init` - Evaluator initialization
          - `wrap_llm` - Wrapping LLM for Ragas
          - `wrap_embedder` - Wrapping embedder for Ragas
          - `init_metrics` - Initializing evaluation metrics
            - `init_response_relevancy`
            - `init_context_precision`
            - `init_faithfulness`

### 2. **Request Processing**
- `lambda_handler` - Main handler execution
  - `process_record_{idx}` - Processing each SQS record
    - `judge_evaluate` - High-level evaluation call
      - `judge_evaluate_method` - Evaluation logic
        - `condense_query` - Query condensation (if messages present)
          - `messages_to_chathistory` - Converting messages to chat history
          - `llm_acomplete` - LLM completion call
        - `evaluator_evaluate` - Running evaluation
          - `evaluator_evaluate_method` - Evaluation logic
            - `create_sample` - Creating evaluation sample
            - `ragas_evaluate` - Running Ragas metrics
            - `process_scores` - Processing results
        - `add_langfuse_scores` - Sending scores to Langfuse

## Configuration

Set environment variables to control trace export:

### Console Output (Development)
```bash
export OTEL_TRACES_EXPORTER=console
export OTEL_SERVICE_NAME=chatbot-evaluate
```

### OTLP Exporter (Production)
For AWS X-Ray, Jaeger, or other OTLP-compatible backends:
```bash
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
export OTEL_SERVICE_NAME=chatbot-evaluate
export OTEL_SERVICE_VERSION=0.1.0
```

### Disable Tracing
```bash
export OTEL_TRACES_EXPORTER=none
```

## Viewing Traces

### Console Output
When using `console` exporter, traces will appear in CloudWatch Logs. Look for JSON output like:
```json
{
  "name": "judge_initialization",
  "context": {...},
  "kind": "SpanKind.INTERNAL",
  "parent_id": null,
  "start_time": "...",
  "end_time": "...",
  "attributes": {...}
}
```

### AWS X-Ray Integration
To send traces to AWS X-Ray, you can use the AWS Distro for OpenTelemetry (ADOT) Lambda layer:

1. Add the ADOT Lambda layer to your function
2. Set environment variables:
   ```bash
   OTEL_TRACES_EXPORTER=otlp
   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
   AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument
   ```

### Other Backends
For Jaeger, Zipkin, Honeycomb, etc., set the appropriate OTLP endpoint.

## Analyzing Performance

### Key Metrics to Monitor

1. **Cold Start Time** - `judge_initialization` span
   - Check which component takes longest:
     - LLM model loading (`get_llm`)
     - Embedding model loading (`get_embed_model`)
     - Metric initialization (`init_metrics`)

2. **Request Processing** - `lambda_handler` span
   - Per-record processing time
   - LLM calls (`llm_acomplete`, `ragas_evaluate`)
   - External service calls (Langfuse)

3. **Library Import Time** - Look for `import_*` spans
   - `import_google_genai`
   - `import_google_genai_embedding`

### Example Analysis

If you see high cold start times:
- Check `import_google_genai` and `import_google_genai_embedding` spans - these imports can be slow
- Check `instantiate_google_llm` and `instantiate_google_embedding` - model initialization may be heavy
- Check `init_metrics` - Ragas metric initialization can take time

If you see high request processing times:
- Check `llm_acomplete` - LLM API calls
- Check `ragas_evaluate` - Evaluation can make multiple LLM calls
- Check `add_langfuse_scores` - Network calls to external service

## Span Attributes

Each span includes contextual attributes:

- **lambda_handler**: `event.records_count`
- **process_record**: `trace_id`, `has_messages`, `contexts_count`
- **judge_evaluate_method**: `trace_id`, `has_messages`, `contexts_count`
- **evaluator_evaluate_method**: `contexts_count`, `query_length`, `response_length`
- **get_llm**: `provider`, `model_id`
- **get_embed_model**: `provider`, `model_id`

Use these attributes to correlate performance with request characteristics.

## Troubleshooting

### No traces appearing
1. Check that `OTEL_TRACES_EXPORTER` is set correctly
2. Verify CloudWatch Logs for any OpenTelemetry errors
3. Check that spans are being created (add debug logging)

### High overhead
1. Consider sampling in production (configure TracerProvider with sampler)
2. Use BatchSpanProcessor (already configured) instead of SimpleSpanProcessor
3. Reduce instrumentation granularity if needed

### Missing spans
1. Ensure all code paths create spans
2. Check for exceptions that might prevent span completion
3. Verify async operations are properly traced
