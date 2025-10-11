FROM public.ecr.aws/lambda/python:3.12@sha256:286a449432fbf443e0ba1c15aab132a3a7d329bb7ee5a0d18031c05fb712d8d5
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
