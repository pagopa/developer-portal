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
from src.modules.async_bedrock import AsyncBedrock


nest_asyncio.apply()
logging.basicConfig(level=logging.INFO)


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
            raise TypeError("The eval prompt must be a string.")

        self._refine_template: BasePromptTemplate
        if isinstance(refine_template, str):
            self._refine_template = PromptTemplate(refine_template)
        else:
            raise TypeError("The refine prompt must be a string.")

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
    params = yaml.safe_load(open("config/params.yaml", "r"))
    prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
    eval_prompts = yaml.safe_load(open("config/eval_prompts.yaml", "r"))
    bot = Chatbot(params, prompts)
    eval_model = AsyncBedrock(
        model=params["models"]["model_id"],
        temperature=params["models"]["temperature"],
        max_tokens=params["models"]["max_tokens"],
        use_guardrail=False
    )

    # load FAQs
    faqs = json.load(open("faqs.json", "r"))
    questions = [sample["query"] for sample in faqs]
    ref_responses = [sample["reference"] for sample in faqs]

    # evaluation metrics
    evaluator_dict = {
        "answer_relevancy": AnswerRelevancyEvaluator(
            llm=eval_model,
            eval_template=eval_prompts["answer_relevacy_prompt_str"],
            parser_function=parser_function,
            score_threshold=1.
        ),
        "context_relevancy": ContextRelevancyEvaluator(
            llm=eval_model,
            eval_template=eval_prompts["context_relevacy_prompt_str"],
            parser_function=parser_function,
            score_threshold=1.
        ),
        "faithfulness": MyFaithfulnessEvaluator(
            llm=eval_model,
            eval_template=eval_prompts["faithfulness_prompt_str"],
            refine_template=eval_prompts["faithfulness_refine_prompt_str"],
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
