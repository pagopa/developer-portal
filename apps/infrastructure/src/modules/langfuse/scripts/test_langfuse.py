import os
import time
import patch_pydantic  # noqa: F401
from langfuse import Langfuse


# --- CONFIGURATION ---
LANGFUSE_PUBLIC_KEY = os.environ.get("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.environ.get("LANGFUSE_SECRET_KEY")
# IMPORTANT: Use YOUR cloud instance URL here
LANGFUSE_HOST = os.environ.get("LANGFUSE_HOST")


def run_test():
    # 1. Initialize Client
    langfuse = Langfuse(
        public_key=LANGFUSE_PUBLIC_KEY,
        secret_key=LANGFUSE_SECRET_KEY,
        host=LANGFUSE_HOST,
        debug=True  # Enable debug to see logs in console
    )

    print("Sending trace...")

    # Create a span using a context manager
    with langfuse.start_as_current_observation(as_type="span", name="process-request") as span:
        # Your processing logic here
        span.update(output="Processing complete")
 
    # Create a nested generation for an LLM call
    with langfuse.start_as_current_observation(as_type="generation", name="llm-response", model="gpt-3.5-turbo") as generation:
        # Your LLM call logic here
        generation.update(output="Generated response")
 
    # All spans are automatically closed when exiting their context blocks
 
 
    # Flush events in short-lived applications
    langfuse.flush()

if __name__ == "__main__":
    run_test()