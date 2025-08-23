FROM public.ecr.aws/lambda/python:3.12@sha256:ac0aacb95d3d14adee870e543ca82ee3b4c7f5f91e0ddf2e67df5ff2076d6460
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
