FROM public.ecr.aws/lambda/python:3.12
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml poetry.lock ./
COPY ./config ./config
COPY ./src ./src
COPY ./scripts ./scripts
COPY ./.google_service_account.json .

RUN poetry config virtualenvs.create false
RUN poetry install
RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

CMD ["src.lambda_function.lambda_handler"]
