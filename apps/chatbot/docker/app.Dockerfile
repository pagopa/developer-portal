FROM public.ecr.aws/lambda/python:3.12@sha256:2b907880cd2ebc58e8913e939e81627d57307a62e536faf0a8232b74e2557d4a

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install --only main

COPY ./CHANGELOG.md .
COPY ./src ./src
COPY ./config ./config
COPY ./scripts ./scripts
RUN python ./scripts/nltk_download.py

RUN chown -R 1000:1000 ${LAMBDA_TASK_ROOT}

USER 1000

CMD ["src.app.main.handler"]
