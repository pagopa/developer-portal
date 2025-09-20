FROM public.ecr.aws/lambda/python:3.12@sha256:d8cb5f683d81189f59c186ece3b62248fd40b9f56b072e7c1fb18ec87b0749d6
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
