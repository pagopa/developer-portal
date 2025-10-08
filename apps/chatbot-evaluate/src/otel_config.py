"""
OpenTelemetry configuration for AWS Lambda.
Configure this module to export traces to your preferred backend.
"""
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter


def configure_tracer():
    """
    Configure OpenTelemetry tracer for Lambda.
    
    Environment variables:
    - OTEL_EXPORTER_OTLP_ENDPOINT: OTLP endpoint (e.g., http://collector:4317)
    - OTEL_SERVICE_NAME: Service name for traces (default: chatbot-evaluate)
    - OTEL_TRACES_EXPORTER: Exporter type (console, otlp, or none) (default: console)
    """
    
    service_name = os.getenv("OTEL_SERVICE_NAME", "chatbot-evaluate")
    traces_exporter = os.getenv("OTEL_TRACES_EXPORTER", "console")
    
    # Create resource with service information
    resource = Resource(attributes={
        SERVICE_NAME: service_name,
        SERVICE_VERSION: os.getenv("OTEL_SERVICE_VERSION", "0.1.0"),
    })
    
    # Create tracer provider
    provider = TracerProvider(resource=resource)
    
    # Configure exporter based on environment
    if traces_exporter == "otlp":
        # OTLP exporter for production (e.g., to AWS X-Ray, Jaeger, etc.)
        otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
        if otlp_endpoint:
            exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
            provider.add_span_processor(BatchSpanProcessor(exporter))
            print(f"OpenTelemetry configured with OTLP exporter to {otlp_endpoint}")
        else:
            print("WARNING: OTLP exporter requested but OTEL_EXPORTER_OTLP_ENDPOINT not set")
    elif traces_exporter == "console":
        # Console exporter for development/debugging
        exporter = ConsoleSpanExporter()
        provider.add_span_processor(BatchSpanProcessor(exporter))
        print("OpenTelemetry configured with Console exporter")
    else:
        print(f"OpenTelemetry traces disabled (exporter: {traces_exporter})")
    
    # Set the tracer provider
    trace.set_tracer_provider(provider)
    
    return provider
