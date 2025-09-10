{
    "widgets": [
        {
            "type": "text",
            "x": 0,
            "y": 0,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "## FE (CDN)  ${domain_name}\n"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 1,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", "${website_distribution_id}", { "region": "us-east-1" } ]
                ],
                "region": "${aws_region}",
                "stacked": false,
                "timezone": "UTC",
                "title": "Requests",
                "view": "timeSeries"
            }
        },
        {
            "type": "metric",
            "x": 8,
            "y": 1,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ { "expression": "ANOMALY_DETECTION_BAND(m1, 2)", "label": "Anomaly", "id": "e1" } ],
                    [ "AWS/CloudFront", "4xxErrorRate", "Region", "Global", "DistributionId", "${website_distribution_id}", { "region": "us-east-1", "id": "m1" } ],
                    [ ".", "5xxErrorRate", ".", ".", ".", ".", { "region": "us-east-1", "id": "m2" } ]
                ],
                "region": "${aws_region}",
                "stacked": false,
                "timezone": "UTC",
                "title": "4xxErrorRate, 5xxErrorRate",
                "view": "timeSeries",
                "period": 300,
                "stat": "Average"
            }
        },
        {
            "type": "metric",
            "x": 16,
            "y": 1,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "BytesUploaded", "Region", "Global", "DistributionId", "${website_distribution_id}", { "region": "us-east-1" } ],
                    [ ".", "BytesDownloaded", ".", ".", ".", ".", { "region": "us-east-1" } ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "title": "Data transfer",
                "yAxis": {
                    "left": {
                        "showUnits": false
                    },
                    "right": {
                        "showUnits": false
                    }
                },
                "stat": "Sum"
            }
        },
        {
            "type": "text",
            "x": 0,
            "y": 7,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "## FE (CDN)  ${static_contents_domain_name}\n"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 8,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", "${static_contents_domain_name}", { "region": "us-east-1" } ]
                ],
                "region": "${aws_region}",
                "stacked": false,
                "timezone": "UTC",
                "title": "Requests",
                "view": "timeSeries",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 8,
            "y": 8,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ { "expression": "ANOMALY_DETECTION_BAND(m1, 2)", "label": "Anomaly", "id": "e1" } ],
                    [ "AWS/CloudFront", "4xxErrorRate", "Region", "Global", "DistributionId", "${static_contents_domain_name}", { "region": "us-east-1", "id": "m1" } ],
                    [ ".", "5xxErrorRate", ".", ".", ".", ".", { "region": "us-east-1", "id": "m2" } ]
                ],
                "region": "${aws_region}",
                "stacked": false,
                "timezone": "UTC",
                "title": "4xxErrorRate, 5xxErrorRate",
                "view": "timeSeries",
                "period": 300,
                "stat": "Average"
            }
        },
        {
            "type": "metric",
            "x": 16,
            "y": 8,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "BytesUploaded", "Region", "Global", "DistributionId", "${static_contents_domain_name}", { "region": "us-east-1" } ],
                    [ ".", "BytesDownloaded", ".", ".", ".", ".", { "region": "us-east-1" } ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "title": "Data transfer",
                "yAxis": {
                    "left": {
                        "showUnits": false
                    },
                    "right": {
                        "showUnits": false
                    }
                },
                "stat": "Sum",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 15,
            "width": 6,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Invocations", "FunctionName", "${opennext_lambda_function_name}", { "id": "m1" } ]
                ],
                "sparkline": true,
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "stat": "SampleCount",
                "period": 300,
                "title": "Invocations"
            }
        },
        {
            "type": "text",
            "x": 0,
            "y": 14,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "## Opennext (${opennext_lambda_function_name})"
            }
        },
        {
            "type": "metric",
            "x": 6,
            "y": 15,
            "width": 6,
            "height": 6,
            "properties": {
                "metrics": [
                    [ { "expression": "ANOMALY_DETECTION_BAND(m1, 2)", "label": "Anomaly detection", "id": "e1" } ],
                    [ "AWS/Lambda", "Errors", "FunctionName", "${opennext_lambda_function_name}", { "region": "${aws_region}", "id": "m1" } ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "title": "Errors",
                "period": 300,
                "stat": "Average"
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 15,
            "width": 6,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Duration", "FunctionName", "${opennext_lambda_function_name}" ],
                    [ "...", { "stat": "Maximum" } ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "stat": "Average",
                "period": 300,
                "title": "Duration"
            }
        },
        {
            "type": "metric",
            "x": 18,
            "y": 15,
            "width": 6,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Throttles", "FunctionName", "${opennext_lambda_function_name}" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${aws_region}",
                "stat": "Sum",
                "period": 300,
                "title": "Throttles"
            }
        }
    ]
}