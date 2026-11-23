# **Monitoring US-East-1 WAF in EU Regions**

[https\://gemini.google.com/app/29eb4fa8bb32ae35](https://gemini.google.com/app/29eb4fa8bb32ae35)

*User prompt: You are an AWS expert. \- I have a Cloudfront distribution \- It has attached a WAF with a couple of rules. \- The waf publishes it metric in us-east-1 since cloudfront must be created in us-east-1: it's a global resource. \- I want to create alert in cloudwatch based on some WAF metrics. \- Unfortunately I can't since I have a SCP that does not allow me to create resources outside eu\* regions. \- The exception is only cloudfront. Is there any workaround? How can I do that?*

Response: Because CloudWatch Alarms cannot evaluate metrics across different regions, and your Service Control Policy (SCP) blocks creating a CloudWatch Alarm in us-east-1, you have to **bring the WAF telemetry into an eu-\* region** so you can evaluate and alert on it locally.

Depending on what resources your SCP permits in us-east-1, there are three reliable workarounds.

### **Option 1: WAF Logging to an eu-\* S3 Bucket \+ EventBridge/Lambda (Best if us-east-1 is strictly locked down)**

Even though a CloudFront-scoped Web ACL lives in us-east-1, **AWS WAF supports cross-region log delivery directly to an Amazon S3 bucket in an eu-\* region** without needing Firehose or any additional resources in us-east-1.

**1Create an S3 Bucket in your EU region**

e.g., eu-west-1 or eu-central-1

Create a standard S3 bucket in your allowed eu-\* region. Ensure its bucket policy allows the AWS WAF log delivery service (delivery.logs.amazonaws.com) to write objects (s3:PutObject) to it. *Verification:* Bucket is created in your eu-\* region with the delivery.logs.amazonaws.com bucket policy attached.

**2Configure WAF Logging to the EU S3 Bucket**

No us-east-1 resources created

In the AWS WAF console (us-east-1), open your Web ACL, go to **Logging and metrics**, and set the logging destination to **Amazon S3 bucket**, selecting the eu-\* bucket you just created (this uses CloudWatch Vended Logs under the hood and requires no Firehose stream). *Verification:* Within 5–10 minutes of receiving traffic, .gz log files appear under AWSLogs/\<account-id\>/WAFLogs/cloudfront/ in your EU S3 bucket.

**3Process Logs in EU and Publish Custom Metrics**

EventBridge \+ Lambda in eu-\*

Create an S3 Event Notification (or EventBridge rule) in your eu-\* region that triggers a lightweight AWS Lambda function whenever a new WAF log file lands in the bucket. Have the Lambda parse the JSON log lines (counting BLOCK actions or specific terminatingRuleId matches) and call cloudwatch:PutMetricData to push custom metrics into your eu-\* CloudWatch namespace. *Verification:* Custom metrics appear under your chosen namespace in CloudWatch in your eu-\* region.

**4Create the CloudWatch Alarm in EU**

Standard EU resource

Create a standard CloudWatch Alarm in your eu-\* region targeting your newly published custom metrics, and attach your SNS notification topic. *Verification:* The alarm transitions from Insufficient data to OK in your eu-\* CloudWatch console.

*Trade-off:* WAF Vended Logs to S3 deliver in roughly **5-minute batches**, so alerts will have a \~5–7 minute latency compared to native 1-minute CloudWatch metrics.

### **Option 2: Scheduled Lambda Poller in eu-\* Calling GetMetricData (Zero us-east-1 changes required)**

An SCP restricting resource creation (cloudwatch:PutMetricAlarm) in us-east-1 rarely blocks read-only API calls like cloudwatch:GetMetricData. You can run everything inside your eu-\* region and pull the us-east-1 metrics over the AWS API.

> 1. **Create a Lambda function in eu-\*:** Write a short Python/Node.js script using the AWS SDK configured with region\_name="us-east-1" to call cloudwatch.get\_metric\_data() for your WAF metrics (namespace AWS/WAFV2, Region="Global", WebACL="\<your-acl\>", Rule="\<your-rule\>").  
> 2. **Republish or Alert Directly:**  
   * **Republish:** Have the Lambda immediately call cloudwatch.put\_metric\_data() in your local eu-\* region, allowing you to use standard eu-\* CloudWatch Alarms and dashboards.  
   * **Direct Alert:** Have the Lambda check the threshold itself and publish directly to an eu-\* SNS topic if breached.  
> 3. **Schedule via EventBridge:** Trigger the Lambda every 1 or 5 minutes using an EventBridge Scheduler rule in eu-\*.

*Trade-off:* Very low latency (1-minute resolution) and touches zero infrastructure in us-east-1, provided your SCP does not explicitly deny cloudwatch:GetMetricData when aws:RequestedRegion is us-east-1.

### **Option 3: Request a Narrow SCP Exception for CloudWatch Alarms**

If your security team already carved out an exception for cloudfront:\* and wafv2:\* in us-east-1 because they are global control-plane services, the cleanest long-term fix is adding cloudwatch:PutMetricAlarm (and sns:CreateTopic / sns:Publish if needed) to that same us-east-1 SCP exception block:

`{`  
  `"Sid": "DenyNonEURegionsWithGlobalExceptions",`  
  `"Effect": "Deny",`  
  `"NotAction": [`  
    `"cloudfront:*",`  
    `"wafv2:*",`  
    `"cloudwatch:PutMetricAlarm",`  
    `"cloudwatch:DeleteAlarms",`  
    `"cloudwatch:DescribeAlarms"`  
  `],`  
  `"Resource": "*",`  
  `"Condition": {`  
    `"StringNotLike": {`  
      `"aws:RequestedRegion": "eu-*"`  
    `}`  
  `}`  
`}`

*(Note: A us-east-1 CloudWatch Alarm can publish to an SNS topic, though cross-region SNS notifications from an alarm require configuring an EventBridge rule in us-east-1 to forward alarm state changes to an eu-\* SNS topic—which makes **Option 1** or **Option 2** easier if your security team strictly minimizes us-east-1 exceptions.)*

**Sources**

> 1. [AWS WAF Virtual Patching: Stop Zero-Day Exploits](https://aws.plainenglish.io/zero-day-zero-panic-how-to-buy-time-with-aws-waf-virtual-patching-e23e57095b9d)

---

*User prompt: How can I create a cross region sns topic?*

Response: Amazon SNS topics are strictly regional resources—you cannot natively create a single "cross-region" SNS topic, and a CloudWatch Alarm in us-east-1 cannot directly publish to an SNS topic in an eu-\* region.

To route an alarm or event from us-east-1 to an SNS topic in an eu-\* region, you have two standard architectures depending on what your SCP allows in us-east-1.

### **Method 1: EventBridge Cross-Region Routing (No Code)**

CloudWatch Alarms automatically emit state-change events to the default Amazon EventBridge bus in their local region. You can forward those events across regions to an EventBridge bus in your eu-\* region, which then triggers your local eu-\* SNS topic.

**1Create the SNS Topic in your EU region**

Destination region (e.g., eu-shout-1)

Open the Amazon SNS console in your allowed eu-\* region, choose **Topics** \-\> **Create topic**, select **Standard**, and add your subscriptions (email, Slack/Chatbot, webhook, etc.). Copy the Topic ARN. *Verification:* Topic status is active and email/endpoint subscriptions show **Confirmed**.

**2Create an EventBridge Rule in EU to Publish to SNS**

Destination region (eu-\*)

In the eu-\* EventBridge console, go to **Rules** \-\> **Create rule** on the default event bus. Use an event pattern matching CloudWatch Alarm state changes ("source": \["aws.cloudwatch"\], "detail-type": \["CloudWatch Alarm State Change"\]), and set the target to your eu-\* SNS topic. (Ensure the SNS topic access policy allows events.amazonaws.com to call SNS:Publish). *Verification:* Rule is enabled on the eu-\* default event bus pointing to your EU SNS topic.

**3Create a Forwarding Rule in us-east-1**

Source region (us-east-1)

In us-east-1 EventBridge, create a rule on the default event bus matching your alarm's state change event. Under **Target types**, select **EventBridge event bus**, choose **Event bus in a different account or Region**, and paste the ARN of your eu-\* default event bus (arn:aws:events:\<eu-region\>:\<account-id\>:event-bus/default). *Verification:* Trigger a test state change using aws cloudwatch set-alarm-state \--region us-east-1 and confirm the notification arrives via your EU SNS topic.

*(Note: This requires your SCP to allow events:PutRule and events:PutTargets in us-east-1.)*

### **Method 2: Local us-east-1 SNS Topic \+ EU Lambda Forwarder**

If you prefer using SNS subscriptions directly, you create a relay SNS topic in us-east-1 that invokes a Lambda function hosted in your eu-\* region, which then republishes the message to your eu-\* SNS topic.

> 1. **Create your primary SNS topic in eu-\*:** Create the Standard SNS topic and attach your actual subscriber endpoints in your eu-\* region.  
> 2. **Deploy a forwarder Lambda in eu-\*:** Create a lightweight Lambda function in your eu-\* region with sns:Publish permission on your eu-\* topic. Have it read event\['Records'\]\[0\]\['Sns'\]\['Message'\] and call sns.publish() to your eu-\* topic ARN.  
> 3. **Create a relay SNS topic in us-east-1:** Create a Standard SNS topic in us-east-1 and attach it to your us-east-1 CloudWatch Alarm.  
> 4. **Subscribe the EU Lambda to the us-east-1 topic:** SNS supports cross-region Lambda subscriptions natively. In us-east-1 SNS, create a subscription with protocol **AWS Lambda** and enter the ARN of your eu-\* Lambda function.

### **Alternative: AWS User Notifications (Zero Cross-Region Plumbing)**

If your goal is simply receiving email, Slack, or mobile alerts for a us-east-1 CloudWatch Alarm without managing custom EventBridge buses or Lambda forwarders, **AWS User Notifications** aggregates CloudWatch Alarm state changes across multiple regions natively. However, because its control plane is centralized in us-east-1, your SCP must allow notifications:\* in us-east-1 to configure it.

**Sources**

> 1. [Customize Amazon CloudWatch alarm notifications to your local](https://aws.amazon.com/blogs/mt/customize-amazon-cloudwatch-alarm-notifications-to-your-local-time-zone-part-2/)  
> 2. [Invoke a cross account Amazon SNS topic with a CloudWatch alarm](https://repost.aws/knowledge-center/cloudwatch-cross-account-sns)  
> 3. [Notifying users on alarm changes \- Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Notify_Users_Alarm_Changes.html)

---

*User prompt: Give me the exact EventBridge event pattern and SNS resource policy JSON for Method 1\.*

Response: For **Method 1 (EventBridge Cross-Region Routing)**, you need two EventBridge rules (one in us-east-1 to forward the event, and one in your eu-\* region to catch it) plus a resource-based access policy on your eu-\* SNS topic.

### **1\. EventBridge Event Pattern (us-east-1 Forwarding Rule)**

Create this rule on the default event bus in **us-east-1** and set its target to your eu-\* default event bus (arn:aws:events:\<eu-region\>:\<account-id\>:event-bus/default).

This pattern filters specifically for your WAF alarm entering the ALARM state (preventing noisy notifications when it recovers to OK or briefly hits INSUFFICIENT\_DATA):

`{`  
  `"source": ["aws.cloudwatch"],`  
  `"detail-type": ["CloudWatch Alarm State Change"],`  
  `"detail": {`  
    `"alarmName": ["YOUR-WAF-ALARM-NAME"],`  
    `"state": {`  
      `"value": ["ALARM"]`  
    `}`  
  `}`  
`}`

*(Tip: If you want notifications both when the alarm triggers AND when it resolves, change "value": \["ALARM"\] to "value": \["ALARM", "OK"\]. To match multiple alarms sharing a naming prefix, use "alarmName": \[{"prefix": "waf-"}\].)*

### **2\. EventBridge Event Pattern (eu-\* Receiver Rule)**

Create this rule on the default event bus in your **eu-\* region** and set its target to your eu-\* SNS topic. Adding "region": \["us-east-1"\] ensures it only processes events forwarded from your us-east-1 alarm:

`{`  
  `"source": ["aws.cloudwatch"],`  
  `"detail-type": ["CloudWatch Alarm State Change"],`  
  `"region": ["us-east-1"],`  
  `"detail": {`  
    `"alarmName": ["YOUR-WAF-ALARM-NAME"],`  
    `"state": {`  
      `"value": ["ALARM"]`  
    `}`  
  `}`  
`}`

### **3\. SNS Topic Access Policy (eu-\* Region)**

Add the following statement to the **Access policy** of your SNS topic in your **eu-\* region** so EventBridge is authorized to publish messages to it:

`{`  
  `"Version": "2012-10-17",`  
  `"Statement": [`  
    `{`  
      `"Sid": "AllowEventBridgeToPublish",`  
      `"Effect": "Allow",`  
      `"Principal": {`  
        `"Service": "events.amazonaws.com"`  
      `},`  
      `"Action": "sns:Publish",`  
      `"Resource": "arn:aws:sns:<eu-region>:<account-id>:<your-eu-topic-name>"`  
    `}`  
  `]`  
`}`

**Important AWS Quirk:** Do **not** add a Condition block (such as aws:SourceArn or aws:SourceAccount) to the SNS topic policy above. Amazon EventBridge does not populate source condition keys when publishing directly to an SNS topic via a resource-based policy—adding a Condition block will cause EventBridge delivery to fail silently.

*(Note: If your eu-\* SNS topic has **Server-Side Encryption (SSE)** enabled with a customer-managed KMS key, you must also add a statement to that KMS key's policy allowing "Principal": {"Service": "events.amazonaws.com"} to perform "kms:GenerateDataKey\*" and "kms:Decrypt".)*

---