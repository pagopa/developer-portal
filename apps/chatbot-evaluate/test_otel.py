#!/usr/bin/env python3
"""
Test script to verify OpenTelemetry instrumentation.
This simulates a Lambda invocation and outputs traces to console.
"""
import os
import json

# Set console exporter for testing
os.environ["OTEL_TRACES_EXPORTER"] = "console"
os.environ["OTEL_SERVICE_NAME"] = "chatbot-evaluate-test"
os.environ["CHB_PROVIDER"] = "mock"  # Use mock provider for testing

# Import after setting environment
from src.lambda_function import lambda_handler


def test_cold_start_tracing():
    """Test that cold start is traced"""
    print("=" * 80)
    print("Testing Cold Start Tracing")
    print("=" * 80)
    print("\nThe JUDGE initialization should have created traces during import.")
    print("Look for 'judge_initialization' span above.\n")


def test_request_processing():
    """Test request processing tracing"""
    print("=" * 80)
    print("Testing Request Processing Tracing")
    print("=" * 80)
    
    # Create a mock SQS event
    event = {
        "Records": [
            {
                "messageId": "test-message-1",
                "body": json.dumps({
                    "trace_id": "test-trace-123",
                    "query_str": "What is the payment process?",
                    "response_str": "The payment process involves...",
                    "retrieved_contexts": [
                        "Context 1: Payment information",
                        "Context 2: Process details"
                    ],
                    "messages": None
                })
            }
        ]
    }
    
    # Mock context
    class MockContext:
        function_name = "test-function"
        memory_limit_in_mb = 512
        invoked_function_arn = "arn:aws:lambda:us-east-1:123456789012:function:test"
        aws_request_id = "test-request-123"
    
    print("\nInvoking lambda_handler with test event...")
    result = lambda_handler(event, MockContext())
    
    print(f"\n✓ Lambda execution completed")
    print(f"✓ Status: {result['statusCode']}")
    print(f"✓ Results count: {len(result['result'])}")
    
    print("\nLook for the following trace spans above:")
    print("  - lambda_handler")
    print("  - process_record_0")
    print("  - judge_evaluate")
    print("  - judge_evaluate_method")
    print("  - evaluator_evaluate")
    print("  - evaluator_evaluate_method")
    print("  - ragas_evaluate")
    print("  - add_langfuse_scores")


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("OpenTelemetry Instrumentation Test")
    print("=" * 80)
    print("\nThis test will show trace spans in the console output.")
    print("Each span shows the operation name, duration, and attributes.\n")
    
    test_cold_start_tracing()
    print("\n")
    test_request_processing()
    
    print("\n" + "=" * 80)
    print("Test Complete")
    print("=" * 80)
    print("\nReview the spans above to identify heavy operations:")
    print("  • Look for spans with long durations")
    print("  • Check initialization spans (get_llm, get_embed_model)")
    print("  • Monitor evaluation spans (ragas_evaluate)")
    print("  • Check import spans (import_google_genai)")
    print("\n")
