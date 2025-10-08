# OpenTelemetry Quick Start Guide

## 🎯 What Was Done

Your AWS Lambda function is now fully instrumented with OpenTelemetry to identify heavy library calls and initialization times.

## 📊 Key Instrumentation Points

### Cold Start (Initialization)
The most critical area for Lambda performance:
- ✅ **Judge initialization** - Wrapped with `judge_initialization` span
- ✅ **LLM loading** - Tracked with `get_llm` span (includes Google GenAI import)
- ✅ **Embedding model loading** - Tracked with `get_embed_model` span
- ✅ **Evaluator setup** - Tracked with `create_evaluator` span (includes Ragas metrics)

### Request Processing
- ✅ **Lambda handler** - Overall execution time
- ✅ **Per-record processing** - Individual SQS message handling
- ✅ **LLM calls** - API calls to language models
- ✅ **Evaluation metrics** - Ragas evaluation execution
- ✅ **External services** - Langfuse score reporting

## 🚀 Quick Test

Run the test script to see traces in action:

```bash
cd /Users/walter.traspadini/src/pagopa/developer-portal/apps/chatbot-evaluate
python3 test_otel.py
```

This will output trace spans to the console, showing you exactly where time is spent.

## 🔧 Configuration

### For Local Testing
```bash
export OTEL_TRACES_EXPORTER=console
export OTEL_SERVICE_NAME=chatbot-evaluate
```

### For AWS Lambda (CloudWatch Logs)
Add these environment variables to your Lambda function:
```
OTEL_TRACES_EXPORTER=console
OTEL_SERVICE_NAME=chatbot-evaluate-prod
```

Traces will appear in CloudWatch Logs as JSON.

### For AWS X-Ray Integration
1. Add the ADOT Lambda layer (ARN varies by region):
   ```
   arn:aws:lambda:eu-south-1:184161586896:layer:aws-otel-python-amd64-ver-1-26-0:1
   ```

2. Set environment variables:
   ```
   OTEL_TRACES_EXPORTER=otlp
   OTEL_EXPORTER_OTLP_ENDPOINT=localhost:4317
   AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument
   ```

## 📈 What to Look For

### High Cold Start Times
If your Lambda cold starts are slow, check these spans:

1. **`import_google_genai`** - Google AI library import (can be 1-5 seconds)
2. **`import_google_genai_embedding`** - Embedding library import
3. **`instantiate_google_llm`** - Creating LLM instance
4. **`instantiate_google_embedding`** - Creating embedding instance
5. **`init_metrics`** - Initializing Ragas metrics (Faithfulness, Relevancy, Precision)

### High Request Processing Times
If requests are slow, check:

1. **`llm_acomplete`** - LLM API calls (depends on Google API latency)
2. **`ragas_evaluate`** - Evaluation can make multiple LLM calls
3. **`add_langfuse_scores`** - Network call to Langfuse service

## 🎨 Trace Hierarchy

```
judge_initialization (Cold Start)
├── judge_init
│   ├── load_settings
│   ├── get_llm
│   │   ├── import_google_genai
│   │   └── instantiate_google_llm
│   └── create_evaluator
│       ├── get_embed_model
│       │   ├── import_google_genai_embedding
│       │   └── instantiate_google_embedding
│       └── instantiate_evaluator
│           ├── wrap_llm
│           ├── wrap_embedder
│           └── init_metrics
│               ├── init_response_relevancy
│               ├── init_context_precision
│               └── init_faithfulness

lambda_handler (Request Processing)
├── process_record_0
│   └── judge_evaluate
│       └── judge_evaluate_method
│           ├── condense_query (if messages exist)
│           │   ├── messages_to_chathistory
│           │   └── llm_acomplete
│           ├── evaluator_evaluate
│           │   └── evaluator_evaluate_method
│           │       ├── create_sample
│           │       ├── ragas_evaluate
│           │       └── process_scores
│           └── add_langfuse_scores
└── process_record_1
    └── ...
```

## 💡 Optimization Tips

Based on the traces, you might want to:

1. **Use Lambda Provisioned Concurrency** if cold starts are too slow
2. **Move heavy imports to lazy loading** if specific imports are slow
3. **Cache model instances** if you're reinitializing unnecessarily
4. **Use Lambda Layers** for large dependencies (Google AI libraries)
5. **Increase Lambda memory** - more memory = faster CPU for initialization

## 📚 More Details

See [OTEL_INSTRUMENTATION.md](./OTEL_INSTRUMENTATION.md) for comprehensive documentation.

## ✅ Changes Made

Files modified:
- ✏️ `src/lambda_function.py` - Added OpenTelemetry initialization and handler tracing
- ✏️ `src/modules/judge.py` - Added tracing to Judge class and evaluation
- ✏️ `src/modules/models.py` - Added tracing to model loading functions
- ✏️ `src/modules/evaluator.py` - Added tracing to Evaluator class

Files created:
- ✨ `src/otel_config.py` - OpenTelemetry configuration
- ✨ `OTEL_INSTRUMENTATION.md` - Comprehensive documentation
- ✨ `test_otel.py` - Test script to verify instrumentation

Dependencies already installed in `pyproject.toml`:
- ✅ `opentelemetry-api`
- ✅ `opentelemetry-sdk`
- ✅ `opentelemetry-exporter-otlp`
- ✅ `opentelemetry-distro`
- ✅ `opentelemetry-instrumentation-aws-lambda`
- ✅ `opentelemetry-instrumentation-botocore`

## 🎯 Next Steps

1. Test locally with `python3 test_otel.py`
2. Deploy to Lambda with environment variables set
3. Analyze traces in CloudWatch Logs or X-Ray
4. Identify bottlenecks and optimize accordingly
