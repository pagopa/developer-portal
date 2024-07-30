import os
import json
import sys
import logging
import aioboto3
from botocore.config import Config
from typing import Any, Union, List, Sequence, Literal

from llama_index.llms.bedrock import Bedrock
from llama_index.core.base.embeddings.base import Embedding
from llama_index.embeddings.bedrock.base import BedrockEmbedding, PROVIDER_SPECIFIC_IDENTIFIERS
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError, NoRegionError
from llama_index.core.base.llms.types import (
    ChatMessage,
    ChatResponse,
    CompletionResponse
)

from llama_index.core.llms.callbacks import (
    llm_chat_callback,
    llm_completion_callback,
)
from llama_index.core.bridge.pydantic import Field, PrivateAttr


class AsyncBedrock(Bedrock):

    _session: Any = PrivateAttr()
    use_guardrail: bool = Field(default=True)


    def __init__(self, use_guardrail=True, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize the aioboto3 session here for use in async methods
        self.use_guardrail = use_guardrail
        self._session = aioboto3.Session(
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            aws_session_token=self.aws_session_token,
            region_name=self.region_name,
            profile_name=self.profile_name,
        )

    @llm_completion_callback()
    def complete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponse:
        if not formatted:
            prompt = self.completion_to_prompt(prompt)
        all_kwargs = self._get_all_kwargs(**kwargs)
        request_body = self._provider.get_request_body(prompt, all_kwargs)
        request_body_str = json.dumps(request_body)

        if self.use_guardrail:
            response = self._client.invoke_model(
                body=request_body_str,
                modelId=self.model,
                accept='application/json',
                contentType='application/json',
                trace='ENABLED',
                guardrailIdentifier=os.getenv("CHB_AWS_GUARDRAIL_ID"),
                guardrailVersion=os.getenv("CHB_AWS_GUARDRAIL_VERSION")
            )
        else:
            response = self._client.invoke_model(
                body=request_body_str,
                modelId=self.model,
                accept='application/json',
                contentType='application/json',
                trace='ENABLED',
            )
        
        if 'body' in response:
            response_body_str = response['body'].read()
            response_body = json.loads(response_body_str)
            return CompletionResponse(
                text=self._provider.get_text_from_response(response_body), raw=response_body
            )
        else:
            logging.error("Unexpected response format")


    @llm_completion_callback()
    async def acomplete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponse:
        # Ensure prompt formatting
        if not formatted:
            prompt = self.completion_to_prompt(prompt)
        all_kwargs = self._get_all_kwargs(**kwargs)
        request_body = self._provider.get_request_body(prompt, all_kwargs)
        request_body_str = json.dumps(request_body)

        retry_config = Config(retries={'max_attempts': self.max_retries, 'mode': 'adaptive'},
                              connect_timeout=self.timeout,
                              read_timeout=self.timeout)

        # Use the aioboto3 client within an async with block
        async with self._session.client('bedrock-runtime', config=retry_config) as client:
            if self.use_guardrail:
                response = await client.invoke_model(
                    body=request_body_str,
                    modelId=self.model,
                    accept='application/json',
                    contentType='application/json',
                    trace='ENABLED',
                    guardrailIdentifier=os.getenv("CHB_AWS_GUARDRAIL_ID"),
                    guardrailVersion=os.getenv("CHB_AWS_GUARDRAIL_VERSION")
                )
            else:
                response = await client.invoke_model(
                    body=request_body_str,
                    modelId=self.model,
                    accept='application/json',
                    contentType='application/json',
                    trace='ENABLED',
                )

            if 'body' in response:
                response_body_str = await response['body'].read()
                response_body = json.loads(response_body_str)
                return CompletionResponse(
                    text=self._provider.get_text_from_response(response_body), raw=response_body
                )
            else:
                raise ValueError("Unexpected response format")


    @llm_chat_callback()
    async def achat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponse:
        prompt = self.messages_to_prompt(messages)
        completion_response = await self.acomplete(prompt, formatted=True, **kwargs)
        return completion_response


# class MyBedrockEmbedding(BedrockEmbedding):

#     _session: Any = PrivateAttr()
#     _client: Any = PrivateAttr()

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#         self._session = aioboto3.Session(
#             aws_access_key_id=self.aws_access_key_id,
#             aws_secret_access_key=self.aws_secret_access_key,
#             aws_session_token=self.aws_session_token,
#             region_name=self.region_name,
#             profile_name=self.profile_name,
#         )

#     def _get_embedding(
#         self, payload: Union[str, List[str]], type: Literal["text", "query"]
#     ) -> Union[Embedding, List[Embedding]]:

#         if self._client is None:
#             logging.error("Client not set")

#         provider = self.model_name.split(".")[0]
#         request_body = self._get_request_body(provider, payload, type)

#         try:
#             response = self._client.invoke_model(
#                 body=request_body,
#                 modelId=self.model_name,
#                 accept="application/json",
#                 contentType="application/json",
#             )
#         except NoCredentialsError:
#             logging.error(f"NoCredentialsError: {e}.")
#             sys.exit(1)
#         except PartialCredentialsError:
#             logging.error(f"PartialCredentialsError: {e}")
#             sys.exit(1)
#         except ClientError as e:
#             logging.error(f"ClientError: {e}")
#             sys.exit(1)
#         except NoRegionError as e:
#             logging.error(f"NoRegionError: {e}.")
#             sys.exit(1)
#         except Exception as e:
#             logging.error(f"An unexpected error occurred: {e}")
#             sys.exit(1)

#         resp = json.loads(response.get("body").read().decode("utf-8"))
#         identifiers = PROVIDER_SPECIFIC_IDENTIFIERS.get(provider, None)
#         if identifiers is None:
#             logging.error("Provider not supported")
#         return identifiers["get_embeddings_func"](resp, isinstance(payload, list))
