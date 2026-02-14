FROM python:3.12.4-slim-bullseye@sha256:26ce493641ad3b1c8a6202117c31340c7bbb2dc126f1aeee8ea3972730a81dc6
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=/app

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  zip \
  unzip \
  jq

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
