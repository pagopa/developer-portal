from opentelemetry.sdk.trace import ReadableSpan
from opentelemetry.sdk.trace.export import SpanExporter, SpanExportResult


class DictSpanExporter(SpanExporter):
    def __init__(self):
        self.spans = []

    def export(self, spans: list[ReadableSpan]) -> SpanExportResult:
        for span in spans:

            self.spans.append(
                {
                    "name": span.name,
                    "context": {
                        "span_id": span.context.span_id,
                        "trace_id": span.context.trace_id,
                    },
                    "parent_id": span.parent.span_id if span.parent else None,
                    "attributes": dict(span.attributes),
                    "start_time": span.start_time,
                    "end_time": span.end_time,
                    "status": str(span.status.status_code),
                    "events": [
                        {
                            "name": e.name,
                            "timestamp": e.timestamp,
                            "attributes": dict(e.attributes),
                        }
                        for e in span.events
                    ],
                }
            )

        return SpanExportResult.SUCCESS

    def shutdown(self):
        pass
