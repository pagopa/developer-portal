FROM public.ecr.aws/lambda/python:3.12

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

CMD ["src.app.main.handler"]
