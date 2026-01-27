import boto3
import random
import time
from datetime import datetime

# Configuration
NAMESPACE = "WebinarAppTest"
METRIC_NAME = "ActiveViewers"
WEBINAR_IDS = ["WEBINAR_123", "WEBINAR_456"]
DURATION_HOURS = 1

def send_metrics():
    # Initialize the CloudWatch client
    cw = boto3.client('cloudwatch', region_name='eu-central-1')
    
    print(f"Starting simulation for {DURATION_HOURS} hour(s)...")
    start_time = time.time()
    end_time = start_time + (DURATION_HOURS * 3600)

    try:
        while time.time() < end_time:
            
            metric_data = []
            for webinar_id in WEBINAR_IDS:
                # Always send value of 1
                
                viewer_count = 1
                
                metric_data.append({
                    'MetricName': METRIC_NAME,
                    'Dimensions': [
                        {'Name': 'WebinarId', 'Value': webinar_id}
                    ],
                    'Value': viewer_count,
                    'Unit': 'Count'
                })
            
            # Send batch to CloudWatch
            r = cw.put_metric_data(Namespace=NAMESPACE, MetricData=metric_data)
                
            current_time = datetime.now().strftime("%H:%M:%S")
            print(f"[{current_time}] Sent: {WEBINAR_IDS[0]}={metric_data[0]['Value']}, {WEBINAR_IDS[1]}={metric_data[1]['Value']}")
            
            # Wait for a random interval between 1 and 6 seconds
            sleep_time = random.randint(1, 6)
            time.sleep(sleep_time)

    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
    
    print("Simulation complete.")

if __name__ == "__main__":
    send_metrics()