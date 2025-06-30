# Testbook

In order to test the chatbot functions and its APIs, run:

    pytest

the command test the function explained in the table below.

|             Function             |       Requirements        |            Masked Inputs            |                                                                               Description                                                                                |
| :------------------------------: | :-----------------------: | :---------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    `test_connection_redis()`     |       Redis client        |                None                 |                                                                  Check the connection with Redis is up                                                                   |
|   `test_connection_langfuse()`   |      Langfuse client      |                None                 |                                                                 Check the connection with Langfuse is up                                                                 |
|    `test_cloud_connection()`     | AWS or Gemini credentials |     LLM and Embedding model ID      |                                                                        Check the models' loading                                                                         |
|    `test_prompt_templates()`     |        Llama-index        |           `prompts.yaml`            |                                                    Check the prompts have the same variables of the prompts templates                                                    |
|        `test_pii_mask()`         |         Presidio          |          a string to mask           |                                                                  Check that Presidio works as expected                                                                   |
| `test_messages_to_chathistory()` |        Llama-index        | chat history from the local storage |                                                  Check the write functioning of creating a chat history in Llama-index                                                   |
|     `test_chat_generation()`     |        Llama-index        |             two queries             | Check the chatbot generation given a query, then checks again its functioning generating a new answer usinng a second query and the previous interaction as chat history |
