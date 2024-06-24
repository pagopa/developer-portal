import os
import re
import json
import yaml
import datetime
import logging
import asyncio
import nest_asyncio
from typing import Any

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
Instructions:
Query: {query}
Response: {response}
---------------------
Criteria for Evaluation:
- Directness: How directly does the response address the specific question posed by the query?
- Pertinence: Is the information in the response pertinent to the query without including unrelated or extraneous details?
- Specificity: Does the response provide specific information relevant to the query rather than general or vague information?
---------------------
Scoring:
Score the answer relevance on a scale from 0 to 1, where:
- 0 indicates the response is completely irrelevant to the query.
- 1 indicates the response is perfectly relevant to the query.
Scores in between should reflect partial relevance based on the criteria above.
---------------------
Output Format:
Provide a numerical score between 0 and 1.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
Score: 0.80
Feedback: The response is largely relevant, addressing the main points of the query with specific and pertinent information.
However, it includes some extraneous details that are not directly related to the query, which slightly reduces the relevance.

Score: 0.85
Feedback: The response is highly relevant to the query, providing detailed information and examples that directly address the question.
It includes all the necessary criteria for evaluation and provides a comprehensive analysis of the topic.

Score: 0.20
Feedback: The provided answer is largely irrelevant to the query.
It fails to directly address the specific question and includes information that is off-topic.
The response lacks focus on the main points needed to answer the query and does not provide specific or pertinent details.
To improve, the answer should be more aligned with the query and provide relevant and specific information directly related to the question.
---------------------
Your Task:
Evaluate the relevance of the provided response based on the above criteria and provide a score with a feedback.
"""


CONTEXT_RELEVANCY_PROMPT_STR = """
You are tasked with evaluating the relevance of the provided context in relation to the given query.
Relevance is defined as the degree to which the information in the context directly addresses and pertains to the query.
---------------------
Instructions:
Query: {query_str}
Retrieved Context: {context_str}
---------------------
Criteria for Evaluation:
- Directness: How directly does the context address the query?
- Pertinence: Is the information in the context pertinent to the query without deviating into unrelated areas?
- Specificity: Does the context provide specific information relevant to the query rather than general or tangential details?
---------------------
Scoring:
Score the relevance on a scale from 0 to 1, where:
- 0 indicates the context is completely irrelevant to the query.
- 1 indicates the context is perfectly relevant to the query.
Scores in between should reflect partial relevance based on the criteria above.
---------------------
Output Format:
Provide a numerical score between 0 and 1.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
Score: 0.90
Feedback: The context is highly relevant, directly addressing the main points of the query with specific and pertinent information.
A minor portion of the context includes tangential details, preventing a perfect score.

Example 2:
Score: 0.70
Feedback: The context provides some relevant information about the query's topic. However, it lacks detailed explanations or specific examples.

Score: 0.20
Feedback: The retrieved context is largely irrelevant to the query.
It does not directly address the key aspects of the query and instead includes information that is unrelated and not pertinent.
The context should focus on providing relevant information that directly supports the query's subject.
Improvements are needed to ensure that the context is directly related to and adequately addresses the query.
---------------------
Your Task:
Evaluate the relevance of the given retrieved context based on the above criteria and provide a score with an feedback.
"""


FAITHFULNESS_PROMPT_STR = """
You are tasked with evaluating the faithfulness of the provided context in relation to the given query.
Faithfulness is defined as the degree to which the information in the context accurately reflects and supports the query, without adding extraneous or misleading details.
---------------------
Instructions:
Query: {query_str}
Retrieved Context: {context_str}
---------------------
Criteria for Evaluation:
- Relevance: How relevant is the information in the context to the query?
- Accuracy: Does the context accurately reflect the information needed to address the query?
- Completeness: Does the context provide sufficient information to comprehensively answer the query without omitting critical details?
- Consistency: Is the information consistent with known facts and logical reasoning?
---------------------
Scoring:
Score the faithfulness on a scale from 0 to 1, where:
- 0 indicates the context is entirely unfaithful to the query.
- 1 indicates the context is perfectly faithful to the query.
Scores in between should reflect partial faithfulness based on the criteria above.
---------------------
Output Format:
Provide a numerical score between 0 and 1.
Include a brief feedback for the score, highlighting key factors that influenced the assessment.
---------------------
Output Examples:
Score: 0.85
Feedback: The context is mostly relevant and accurate, providing detailed and correct information that directly addresses the query. However, it lacks some minor details that would make it fully comprehensive.

Score: 0.75
Feedback: The context provides relevant information about different scenarios for the query's topic, including examples and recommendations.
However, there are some inconsistencies and omissions that could be improved. Specifically, ...

Score: 0.2
Feedback: The provided context is not faithful to the query.
It includes information that is either inaccurate or misleading and fails to comprehensively address the core aspects of the query.
The response omits critical details and contains extraneous content that detracts from its accuracy.
To enhance faithfulness, the context should provide accurate, complete, and directly relevant information that truthfully reflects and supports the query.
---------------------
Your Task:
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
- Completeness: a numerical score and feedback must be present.
- Clarity: Ensure the feedback is clear and easily understandable.
- Detail: Add any missing details that can provide a more comprehensive evaluation.
- Balance: Make sure the feedback fairly represents both strengths and weaknesses of the context.
- Specificity: Include specific examples or aspects of the context that influenced the evaluation.
---------------------
Example Refined Evaluation:
Score: 0.85
Feedback: The context is highly relevant and accurate, providing detailed information that directly addresses the query. However, it could be improved by including specific examples or additional details about [specific aspect]. There is also a minor inaccuracy in [specific part], which slightly reduces the overall faithfulness.
---------------------
Your Task:
Refine the existing answer of the given the retrieved context and the criteria above.
Provide a score if this is missing in the existing answer, or updated it if necessary, with a detailed, clear, and comprehensive feedback.
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



if __name__ == "__main__":

    # load chatbot
    params = yaml.safe_load(open("params.yaml", "r"))
    bot = Chatbot(params)

    # load FAQs
    faqs = json.load(open("faqs.json", "r"))
    questions = [sample["query"] for sample in faqs]
    ref_responses = [sample["reference"] for sample in faqs]

    logging.info(f"Generating {len(questions)} answers..")
    pred_responses = asyncio.run(asyncio.gather(
        aget_responses(questions, bot.engine, show_progress=True)
    ))[0]

    # evaluation   
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

    logging.info("Making evaluation..")
    batch_runner = BatchEvalRunner(evaluator_dict, workers=8, show_progress=True)

    eval_results = asyncio.run(asyncio.gather(
        batch_runner.aevaluate_responses(
            questions,
            responses=pred_responses,
            reference=ref_responses
        )
    ))[0]
    
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

    df = pd.DataFrame.from_dict(table)
    metrics = {
        "answer_relevancy": df["answer_relevancy_score"].mean(skipna=True),
        "context_relevancy": df["context_relevancy_score"].mean(skipna=True),
        "faithfulness": df["faithfulness_score"].mean(skipna=True)
    }

    # save results
    now = datetime.datetime.now()
    now_str = now.strftime("%Y-%m-%d_%H:%M:%S")
    results_dir = f"results/{now_str}"
    os.makedirs(results_dir, exist_ok=True)
    df.to_csv(
        os.path.join(results_dir, "evaluation_table.csv"),
        index=False
    )
    json.dump(
        metrics,
        open(os.path.join(results_dir, "avg_scores.json"), "w"),
        indent=4
    )
    logging.info(f"Results stored in {results_dir}")
