FROM public.ecr.aws/lambda/python:3.12
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

#ARG AWS_ACCESS_KEY_ID=missing
#ARG AWS_SECRET_ACCESS_KEY=missing
#ARG AWS_REGION=missing
#ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
#ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
#ENV AWS_REGION=$AWS_REGION

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install

COPY . ${LAMBDA_TASK_ROOT}
CMD ["src.app.main.handler"]
