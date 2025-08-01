FROM public.ecr.aws/lambda/python:3.12@sha256:1b597e7be230763aff4e796ad82132ba7b3ef71ac9c0b6808c43983b7daad694
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install --only main

COPY . ${LAMBDA_TASK_ROOT}
RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

CMD ["src.app.main.handler"]
