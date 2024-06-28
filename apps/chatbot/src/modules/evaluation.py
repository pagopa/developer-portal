import os
import re
import json
import yaml
import datetime
import logging
import asyncio
import nest_asyncio
from typing import Any, List, Dict

import pandas as pd

from llama_index.core.schema import Document
from llama_index.core.indices import SummaryIndex
from llama_index.core.prompts import BasePromptTemplate, PromptTemplate
from llama_index.core.evaluation import (
    BatchEvalRunner,
    AnswerRelevancyEvaluator,
    ContextRelevancyEvaluator
)
from llama_index.core.evaluation.base import BaseEvaluator, EvaluationResult
from llama_index.core.evaluation.eval_utils import aget_responses

from src.modules.chatbot import Chatbot


nest_asyncio.apply()
logging.basicConfig(level=logging.INFO)


ANSWER_RELEVACY_PROMPT_STR = """
You are tasked with evaluating the relevance of a provided response in relation to a given query.
Relevance is defined as the degree to which the response directly addresses and pertains to the query.
---------------------
Evaluation Criteria:
- Directness: How directly does the response address the specific question posed by the query?
- Pertinence: Is the information in the response pertinent to the query without including unrelated or extraneous details?
- Specificity: Does the response provide specific information relevant to the query rather than general or vague information?
- Language: Is the answer provided with the same language as the query?
---------------------
Scoring Criteria:
Score the answer relevance on a scale from 0.0 to 1.0, where:
- 0.0 indicates the response is completely irrelevant to the query.
- 1.0 indicates the response is perfectly relevant to the query.
Scores in between should reflect partial relevance based on the evaluation criteria above.
---------------------
Output Format:
Provide a numerical score between 0.0 and 1.0.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
**High Score Example:**
Query: What is PagoPA and how does it benefit users?
Answer: PagoPA is an electronic payment system developed by the Italian government that allows citizens and businesses to make payments to public administrations and other entities.
It benefits users by providing a secure, transparent, and efficient method of making payments, reducing the need for physical paperwork and queues.

Evaluation:
Score: 0.95
Feedback: The answer is highly relevant to the query, providing a clear definition of PagoPA and directly addressing the benefits to users.
It focuses on the main points of the query without deviating into unrelated areas. Moreover, the answer was generate with the same language of the query.

**Low Score Example:**
Query: What is PagoPA and how does it benefit users?
Answer: PagoPA is a new initiative by the government. People use it for various transactions.
The government has many initiatives to improve services.

Evaluation:
Score: 0.2
Feedback: The answer is largely irrelevant to the query.
It provides a vague description of PagoPA and fails to address how it benefits users.
The response lacks specific details and does not directly answer the question.
---------------------
Your Task:
Given the query: {query}
Given the response: {response}
Evaluate the relevance of the provided response based on the above criteria and provide a score with a feedback.
Evaluation:
"""
# You are tasked with evaluating the relevance of a provided response in relation to a given query.


CONTEXT_RELEVANCY_PROMPT_STR = """
You are tasked with evaluating the relevance of the provided context in relation to the given query.
Relevance is defined as the degree to which the information in the context directly addresses and pertains to the query.
---------------------
Evaluation Criteria:
- Directness: How directly does the context address the query?
- Pertinence: Is the information in the context pertinent to the query without deviating into unrelated areas?
- Specificity: Does the context provide specific information relevant to the query rather than general or tangential details?
---------------------
Scoring Criteria:
Score the relevance on a scale from 0.0 to 1.0, where:
- 0.0 indicates the context is completely irrelevant to the query.
- 1.0 indicates the context is perfectly relevant to the query.
Scores in between should reflect partial relevance based on the evaluation criteria above.
---------------------
Output Format:
Provide a numerical score between 0.0 and 1.0.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
**High Score Example:**
Query: How does PagoPA ensure transaction security?
Retrieved Context: PagoPA employs advanced encryption methods and secure authentication processes to ensure that all transactions are safe.
It also adheres to strict regulatory standards and undergoes regular security audits to maintain a high level of security.

Evaluation:
Score: 0.9
Feedback: The context is highly relevant, directly addressing the query about transaction security with specific details about the methods used by PagoPA to ensure safety.
The information is pertinent and specific to the query.

**Low Score Example:**
Query: How does PagoPA ensure transaction security?
Retrieved Context: PagoPA is a digital payment system used by many people in Italy.
It was created by the government to make payments easier. Many people find it convenient.

Evaluation:
Score: 0.2
Feedback: The context is largely irrelevant to the query. It provides general information about PagoPA without addressing the specific question about transaction security. The response lacks details on security measures, making it unhelpful for the query.
---------------------
Your Task:
Given the query: {query_str}
Given the retrieved context: {context_str}
Evaluate the relevance of the given retrieved context based on the above criteria and provide a score with an feedback.
Evaluation:
"""


FAITHFULNESS_PROMPT_STR = """
You are tasked with evaluating the faithfulness of the provided context in relation to the given query.
Faithfulness is defined as the degree to which the information in the context accurately reflects and supports the query, without adding extraneous or misleading details.
---------------------
Evaluation Criteria:
- Relevance: How relevant is the information in the context to the query?
- Accuracy: Does the context accurately reflect the information needed to address the query?
- Completeness: Does the context provide sufficient information to comprehensively answer the query without omitting critical details?
- Consistency: Is the information consistent with known facts and logical reasoning?
---------------------
Scoring Criteria:
Score the faithfulness on a scale from 0.0 to 1.0, where:
- 0.0 indicates the context is entirely unfaithful to the query.
- 1.0 indicates the context is perfectly faithful to the query.
Scores in between should reflect partial faithfulness based on the criteria above.
---------------------
Output Format:
Provide a numerical score between 0.0 and 1.0.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
**High Score Example:**
Query: What features does PagoPA offer to public administrations?
Retrieved Context: PagoPA offers public administrations a range of features including real-time transaction tracking, integration with existing financial systems, customizable payment options, and detailed reporting tools.
These features enhance the efficiency and transparency of financial operations.

Evaluation:
Score: 0.95
Feedback: The context is highly faithful to the query, accurately describing the features offered by PagoPA to public administrations.
The information is specific, relevant, and provides a comprehensive answer to the query.

**Low Score Example:**
Query: What features does PagoPA offer to public administrations?
Retrieved Context: PagoPA is used by many people to make payments. It was designed to improve the payment process and is supported by the government.
Users can pay for a variety of services.

Evaluation:
Score: 0.25
Feedback: The context is not faithful to the query. It provides general information about PagoPA's use and purpose but fails to describe the specific features offered to public administrations.
The response is inaccurate and incomplete, lacking the necessary details to answer the query properly.
---------------------
Your Task:
Given the query: {query_str}
Given the retrieved context: {context_str}
Evaluate the faithfulness of the given retrieved context based on the above criteria and provide a score with a feedback.
"""

FAITHFULNESS_REFINE_PROMPT_STR = """
You are tasked with refining the faithfulness evaluation of the provided context in relation to the given query.
Ensure the feedback is detailed, clear, and covers all relevant aspects of the evaluation criteria.
---------------------
Instructions:
Original Query: {query_str}
Retrieved Context: {context_str}
Existing answer: {existing_answer}
---------------------
Criteria for Refinement:
- Completeness: a numerical score between 0.0 and 1.0 and a feedback must be in the refined answer.
- Clarity: Ensure the feedback is clear and easily understandable.
- Detail: Add any missing details that can provide a more comprehensive evaluation.
- Balance: Make sure the feedback fairly represents both strengths and weaknesses of the context.
- Specificity: Include specific examples or aspects of the context that influenced the evaluation.
---------------------
Example Refined Evaluation:
**High Score Example:**
Query: What is PagoPA?
Retrieved Context: PagoPA is an Italian digital payment platform developed to streamline and secure payments between citizens, businesses, and public administrations. 
It was launched by the Agency for Digital Italy to facilitate electronic transactions. The system aims to provide a more efficient and transparent payment process.
Existing answer: PagoPA is an Italian digital payment platform developed to streamline and secure payments between citizens, businesses, and public administrations.
It was launched by the Agency for Digital Italy to facilitate electronic transactions. According to the official PagoPA documentation, the system aims to provide a more efficient and transparent payment process.

Refined Evaluation:
Score: 0.95
Feedback: The response accurately describes PagoPA's purpose and origin based on the official documentation.
It correctly mentions the involvement of the Agency for Digital Italy and the goal of improving payment efficiency and transparency.
The details provided align well with the source material, ensuring a high level of faithfulness.

**Low Score Example:**
Query: What is PagoPA?
Retrieved Context: PagoPA is an Italian digital payment platform developed to streamline and secure payments between citizens, businesses, and public administrations. 
It was launched by the Agency for Digital Italy to facilitate electronic transactions. The system aims to provide a more efficient and transparent payment process.
Existing answer: PagoPA is an Italian digital payment platform developed to streamline and secure payments between citizens, businesses, and public administrations.
It was launched by the Agency for Digital Italy to facilitate electronic transactions. According to the official PagoPA documentation, the system aims to provide a more efficient and transparent payment process.

Existing Response: PagoPA is a new cryptocurrency created by the Italian government to promote cashless transactions.
It aims to replace traditional banking methods entirely and is mandatory for all payments in Italy.

Refined Evaluation:
Score: 0.2
Feedback: The response is largely inaccurate and misleading. PagoPA is not a cryptocurrency but a digital payment platform. It does not aim to replace traditional banking methods entirely, nor is it mandatory for all payments in Italy. The response does not align with the official documentation and significantly misrepresents the facts.
---------------------
Your Task:
Refine the existing answer of the given the retrieved context and the criteria above.
Provide a score if this is missing in the existing answer, or updated it if necessary, with a detailed, clear, and comprehensive feedback.
Refined Evaluation:
"""


def parser_function(output_str: str):
    
    # Extracting the score
    score_match = re.search(r"Score:\s*(\d+(\.\d+)?)", output_str)
    score = float(score_match.group(1)) if score_match else None

    # Extracting the feedback
    feedback_match = re.search(r"Feedback:\s*(.*)", output_str, re.DOTALL)
    feedback = feedback_match.group(1).strip() if feedback_match else None

    return score, feedback


class MyFaithfulnessEvaluator(BaseEvaluator):
    """Faithfulness evaluator.
    """

    def __init__(
        self,
        llm,
        raise_error: bool = False,
        eval_template = None,
        refine_template = None,
        parser_function = parser_function,
    ) -> None:
        """Init params."""
        self._llm = llm
        self._raise_error = raise_error

        self._eval_template: BasePromptTemplate
        if isinstance(eval_template, str):
            self._eval_template = PromptTemplate(eval_template)
        else:
            self._eval_template = eval_template or FAITHFULNESS_PROMPT_STR

        self._refine_template: BasePromptTemplate
        if isinstance(refine_template, str):
            self._refine_template = PromptTemplate(refine_template)
        else:
            self._refine_template = refine_template or FAITHFULNESS_REFINE_PROMPT_STR

        self.parser_function = parser_function


    def _get_prompts(self):
        """Get prompts."""
        return {
            "eval_template": self._eval_template,
            "refine_template": self._refine_template,
        }


    def _update_prompts(self, prompts) -> None:
        """Update prompts."""
        if "eval_template" in prompts:
            self._eval_template = prompts["eval_template"]
        if "refine_template" in prompts:
            self._refine_template = prompts["refine_template"]


    async def aevaluate(
        self,
        query: str | None = None,
        response: str | None = None,
        contexts = None,
        sleep_time_in_seconds: int = 0,
        **kwargs: Any,
    ) -> EvaluationResult:
        """Evaluate whether the response is faithful to the contexts."""
        del kwargs

        await asyncio.sleep(sleep_time_in_seconds)

        if contexts is None or response is None:
            raise ValueError("contexts and response must be provided")

        docs = [Document(text=context) for context in contexts]
        index = SummaryIndex.from_documents(docs)

        query_engine = index.as_query_engine(
            llm=self._llm,
            text_qa_template=self._eval_template,
            refine_template=self._refine_template,
        )
        response_obj = await query_engine.aquery(response)

        raw_response_txt = str(response_obj)
        score, reasoning = self.parser_function(raw_response_txt)

        invalid_result, invalid_reason = False, None
        if score is None and reasoning is None:
            if self._raise_error:
                raise ValueError("The response is invalid")
            invalid_result = True
            invalid_reason = "Unable to parse the output string."

        return EvaluationResult(
            query=query,
            response=response,
            contexts=contexts,
            score=score,
            feedback=reasoning,
            invalid_result=invalid_result,
            invalid_reason=invalid_reason,
        )


async def evaluate(
        engine,
        questions: List[str],
        evaluator_dict: Dict[str, BaseEvaluator]
    ) -> pd.DataFrame:

    # generete responses
    logging.info(f"Generating {len(questions)} answers..")
    pred_responses = await aget_responses(questions, engine, show_progress=True)

    logging.info("Making evaluation..")
    batch_runner = BatchEvalRunner(evaluator_dict, workers=8, show_progress=True)
    eval_results = await batch_runner.aevaluate_responses(
        questions,
        responses=pred_responses,
        reference=ref_responses
    )

    return pred_responses, eval_results


def table_results(eval_results):

    table = {
        "ID": list(range(1, len(questions)+1)),
        "query": [a.query for a in eval_results["answer_relevancy"]],
        "response": [a.response.strip() for a in eval_results["answer_relevancy"]],
        "contexts": [f.contexts for f in eval_results["faithfulness"]],
        "answer_relevancy_score": [a.score for a in eval_results["answer_relevancy"]],
        "answer_relevancy_feedback": [a.feedback for a in eval_results["answer_relevancy"]],
        "context_relevancy_score": [c.score for c in eval_results["context_relevancy"]],
        "context_relevancy_feedback": [c.feedback for c in eval_results["context_relevancy"]],
        "faithfulness_score": [f.score for f in eval_results["faithfulness"]],
        "faithfulness_feedback": [f.feedback for f in eval_results["faithfulness"]]
    }

    return pd.DataFrame.from_dict(table)


if __name__ == "__main__":

    # load chatbot
    params = yaml.safe_load(open("params.yaml", "r"))
    bot = Chatbot(params)

    # load FAQs
    faqs = json.load(open("faqs.json", "r"))
    questions = [sample["query"] for sample in faqs]
    ref_responses = [sample["reference"] for sample in faqs]

    # evaluation metrics
    evaluator_dict = {
        "answer_relevancy": AnswerRelevancyEvaluator(
            llm=bot.model,
            eval_template=ANSWER_RELEVACY_PROMPT_STR,
            parser_function=parser_function,
            score_threshold=1.
        ),
        "context_relevancy": ContextRelevancyEvaluator(
            llm=bot.model,
            eval_template=CONTEXT_RELEVANCY_PROMPT_STR,
            parser_function=parser_function,
            score_threshold=1.
        ),
        "faithfulness": MyFaithfulnessEvaluator(
            llm=bot.model,
            eval_template=FAITHFULNESS_PROMPT_STR,
            refine_template=FAITHFULNESS_REFINE_PROMPT_STR,
            parser_function=parser_function
        )
    }

    pred_responses, eval_results = asyncio.run(asyncio.gather(
        evaluate(bot.engine, questions, evaluator_dict)
    ))[0]

    # save results
    now = datetime.datetime.now()
    now_str = now.strftime("%Y-%m-%d_%H:%M:%S")
    results_dir = f"results/{now_str}"
    os.makedirs(results_dir, exist_ok=True)

    df = table_results(eval_results)
    avg_scores = {
        "answer_relevancy": df["answer_relevancy_score"].mean(skipna=True),
        "context_relevancy": df["context_relevancy_score"].mean(skipna=True),
        "faithfulness": df["faithfulness_score"].mean(skipna=True)
    }

    df.to_csv(
        os.path.join(results_dir, "evaluation_table.csv"),
        index=False
    )
    json.dump(
        avg_scores,
        open(os.path.join(results_dir, "avg_scores.json"), "w"),
        indent=4
    )
    logging.info(f"Results stored in {results_dir}")
