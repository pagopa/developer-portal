FROM public.ecr.aws/lambda/python:3.12@sha256:26a9099930531a8f1b9e88eac88c123eca214b8a5e182514b83a4e353b6ed457
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
    && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT

COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
COPY ./scripts ./scripts

RUN poetry config virtualenvs.create false
RUN poetry install
RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambda_function.lambda_handler"]