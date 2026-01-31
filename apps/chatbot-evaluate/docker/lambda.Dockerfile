FROM public.ecr.aws/lambda/python:3.12@sha256:cdfe66594d4a1447912bb1c789029b6993de4160614ca443cf6bbbc2ba7d8ea1
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install

COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambda_function.lambda_handler"]
