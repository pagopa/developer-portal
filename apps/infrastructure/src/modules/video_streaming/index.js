exports.handler = async (event) => {
    // Log the incoming event for debugging
    console.log("Received event:", JSON.stringify(event, null, 2));

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Hello from Lambda!",
            input: event
        }),
    };

    return response;
};