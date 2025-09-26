FROM public.ecr.aws/lambda/python:3.12@sha256:34213b2283e97cf477bdb8dc7698b70ee5a198d2187dd7e30884813792c8e6f1
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
