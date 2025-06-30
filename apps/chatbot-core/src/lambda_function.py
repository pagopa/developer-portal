from src.chatbot_init import chatbot

def lambda_handler(event, context):
    operations = {
        "chat_generate": chatbot.chat_generate,
        "get_final_response": chatbot.get_final_response
    }
    
    operation_name = event.get("operation")
    payload = event.get("payload")

    operation_func = operations.get(operation_name)

    if operation_func:
        result = operation_func(payload)
        return {
            "statusCode": 200,
            "result": result
        }
    else:
        return {
            "statusCode": 400,
            "error": "Invalid input or operation"
        }
