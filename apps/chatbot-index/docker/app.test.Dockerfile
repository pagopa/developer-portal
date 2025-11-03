FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  jq \
  zip \
  less

COPY ./docker/chrome-installer.sh ./chrome-installer.sh

RUN curl -Lo /usr/local/bin/aws-lambda-rie \
  https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie && \
  chmod +x /usr/local/bin/aws-lambda-rie && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm awscliv2.zip && \
  chmod +x ./chrome-installer.sh && \
  ./chrome-installer.sh && \
  rm ./chrome-installer.sh

ENV PYTHONPATH=$LAMBDA_TASK_ROOT
ENV PIP_ROOT_USER_ACTION=ignore

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT

COPY ./pyproject.toml ${LAMBDA_TASK_ROOT}
COPY ./poetry.lock ${LAMBDA_TASK_ROOT}
# COPY ./src ./src
# COPY ./scripts ./scripts

RUN poetry config virtualenvs.create false
RUN poetry install --with test

COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambda_refresh_index.lambda_handler"]
