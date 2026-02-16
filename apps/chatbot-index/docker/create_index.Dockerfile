FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

ENV LAMBDA_TASK_ROOT=/app
ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  zip \
  unzip \
  jq

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

COPY ./docker/chrome-installer.sh ./chrome-installer.sh
RUN chmod +x ./chrome-installer.sh && \
  ./chrome-installer.sh && \
  rm ./chrome-installer.sh

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install --only main

COPY ./src ${LAMBDA_TASK_ROOT}/src
COPY ./config ${LAMBDA_TASK_ROOT}/config
COPY ./scripts ${LAMBDA_TASK_ROOT}/scripts
