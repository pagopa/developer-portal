FROM public.ecr.aws/lambda/python:3.12

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
